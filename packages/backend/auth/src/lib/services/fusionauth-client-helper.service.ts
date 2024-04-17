import { LoggerService } from '@backend/logger';
import FusionAuthClient, {
  JWT,
  ValidateResponse,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { generateRandomString } from '@shared';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
} from '../auth.constants';
import { AuthModuleOptions } from '../types/auth.type';

@Injectable()
export class FusionAuthClientHelper implements OnModuleInit {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly fusionAuthConfigs: AuthModuleOptions,
    @Inject(AUTH_MODULE_FUSIONAUTH_CLIENT)
    private readonly fusionAuthClient: FusionAuthClient,
    private readonly loggerService: LoggerService,
  ) {}

  onModuleInit() {
    this.loggerService.setContext(FusionAuthClientHelper.name);
  }

  /**
   * @description State is used to prevent `CSRF`, we'll also incorporate the redirect url to it so that after successful login we know from which frontend app user came from and should be redirect to.
   */
  encodeRedirectUrlToState(
    redirectUrl: string,
    state: string,
  ): string {
    const encodedRedirectUrl =
      Buffer.from(redirectUrl).toString('base64');

    return encodedRedirectUrl + ':' + state;
  }

  /**
   *
   * @description The PKCE (Proof Key for Code Exchange) extension is designed to protect public clients (e.g. mobile, SPAs) from certain types of attacks when they use the authorization `'code'` grant type. Which is our case.
   * Client generates `codeVerifier` which is a secret value and a derived value called the `code_challenge`. The `codeVerifier` is sent with the authorization request, and the `code_challenge` is sent with the token request.
   *
   * That's also why we are returning `oauthCodeVerifier`. We are creating `code_challenge` in `constructOauth2LoginUrl`.
   *
   * @returns {codeChallenge, codeVerifier}
   */
  async generatePkce() {
    const codeVerifier = generateRandomString(32);
    const data = this.encodeCodeVerifier(codeVerifier);
    // A digest is a short fixed-length value derived from some variable-length input. Cryptographic digests should exhibit collision-resistance, meaning that it's hard to come up with two different inputs that have the same digest value.
    const digestedData = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = Buffer.from(digestedData)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return { codeChallenge, codeVerifier };
  }

  /**
   * @description It receives a code and returns a Uint8Array containing UTF-8 encoded text.
   */
  private encodeCodeVerifier(code: string) {
    const encoder = new TextEncoder();

    return encoder.encode(code);
  }

  /**
   * @description Validates access token and ID token with OAuth server, here we are verifying other important parts of JWT tokens we've received; thing such as iss, aud, etc.
   */
  async verifyExchangedTokens({
    idToken,
    oauthNonce,
    accessToken,
    refreshToken,
  }: {
    idToken: string;
    oauthNonce: string;
    accessToken: string;
    refreshToken: string;
  }): Promise<Promise<never | void>> {
    // Refresh token is not a JWT token, it is a hexadecimal value, thus we do not need to validate it to be a valid JWT token.
    if (!refreshToken) {
      this.loggerService.error(
        'Refresh token is missing in the response of the exchanged tokens for OAuth code!',
      );
      throw new UnauthorizedException();
    }

    const jwtOfAccessToken =
      await this.getJwtOfAccessToken(accessToken);
    if (!jwtOfAccessToken) {
      this.loggerService.error('Exchanged access token is invalid!');
      throw new UnauthorizedException();
    }

    const jwtOfIdToken = await this.getJwtOfIdToken(
      idToken,
      oauthNonce,
    );
    if (!jwtOfIdToken) {
      this.loggerService.error('Exchanged ID token is invalid!');
      throw new UnauthorizedException();
    }
  }

  private async getJwtOfIdToken(
    idToken: string,
    oauthNonce: string,
  ): Promise<void | JWT> {
    let jwtValidationResponse: ClientResponse<ValidateResponse>;
    try {
      jwtValidationResponse =
        await this.fusionAuthClient.validateJWT(idToken);
    } catch (error) {
      this.loggerService.error(
        'ID token is not valid according to the FusionAuthClient lib!',
      );
      return;
    }

    const jwtNonce = jwtValidationResponse.response.jwt?.['nonce'];

    if (!this.areNoncesTheSame(jwtNonce, oauthNonce)) {
      this.loggerService.error({
        message:
          'The passed nonce is not equal to the one in the validated jwt!',
        jwtNonce,
        oauthNonce,
      });
      return;
    }
  }

  private async getJwtOfAccessToken(
    accessToken: string,
  ): Promise<void | JWT> {
    let jwtValidationResponse: ClientResponse<ValidateResponse>;

    try {
      jwtValidationResponse =
        await this.fusionAuthClient.validateJWT(accessToken);
    } catch (error) {
      this.loggerService.error(
        'Access token is not valid according to the FusionAuthClient lib!',
      );
      return;
    }

    if (!this.isIssuerValid(jwtValidationResponse.response.jwt)) {
      return;
    }

    if (!this.isAudienceValid(jwtValidationResponse.response.jwt)) {
      return;
    }

    return jwtValidationResponse.response.jwt;
  }

  private isIssuerValid(jwt: JWT): boolean {
    const jwtIssuer = jwt?.iss;

    if (!jwtIssuer) {
      this.loggerService.error(
        'Issuer is missing in the received access token!',
      );
      return false;
    }
    if (!this.didWeIssued(jwtIssuer)) {
      this.loggerService.error({
        message: 'We did not issue this JWT token!',
        jwtIssuer,
        fusionAuthIssuer: this.fusionAuthConfigs.fusionAuthIssuer,
      });
      return false;
    }

    return true;
  }

  private isAudienceValid(jwt: JWT): boolean {
    const jwtAudience = jwt?.aud;

    if (!jwtAudience) {
      this.loggerService.error(
        'Audience is missing in the received access token!',
      );
      return false;
    }
    if (!this.areWeTheAudienceOf(jwtAudience)) {
      this.loggerService.error({
        message: 'We are not audience of this access token!',
        jwtAudience,
        fusionAuthClientId: this.fusionAuthConfigs.fusionAuthClientId,
      });
      return false;
    }

    return true;
  }

  private areWeTheAudienceOf(audience: string) {
    return audience === this.fusionAuthConfigs.fusionAuthClientId;
  }

  private didWeIssued(issuer: string) {
    return issuer === this.fusionAuthConfigs.fusionAuthIssuer;
  }

  private areNoncesTheSame(nonce1: string, nonce2: string) {
    return nonce1 === nonce2;
  }
}
