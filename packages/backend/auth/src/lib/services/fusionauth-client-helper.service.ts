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

    return jwtValidationResponse.response.jwt;
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
