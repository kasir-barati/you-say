import { LoggerService } from '@backend/logger';
import FusionAuthClient, {
  GroupMember,
  JWT,
  ValidateResponse,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import {
  generateRandomString,
  oauthCookieTokens,
  setCookie,
  setSecureCookie,
} from '@shared';
import { Response } from 'express';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
} from '../auth.constants';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

@Injectable()
export class FusionAuthClientHelper implements OnModuleInit {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly fusionAuthConfigs: AuthModuleOptions,
    @Inject(AUTH_MODULE_FUSIONAUTH_CLIENT)
    private readonly fusionAuthClient: FusionAuthClient,
    private readonly loggerService: LoggerService,
    private readonly fusionAuthErrorSerializer: FusionAuthErrorSerializer,
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
   * @description This method decode the redirect URL from state and also attach locale and userState to the URL in query string so that we can use them in our frontend application to show a welcome message or change the language to whatever the locale might be.
   */
  decodeRedirectUrlFromState({
    state,
    locale,
    userState,
  }: {
    state: string;
    locale: string;
    userState: string;
  }): string {
    const [encodedUri, savedState] = state.split(':');
    const redirectUri = Buffer.from(encodedUri, 'base64').toString(
      'ascii',
    );
    const queryParams = {
      state: savedState,
      locale,
      userState,
    };
    const query = new URLSearchParams(queryParams);

    return `${redirectUri}?${query}`;
  }

  /**
   *
   * @description The PKCE (Proof Key for Code Exchange) extension is designed to protect public clients (e.g. mobile, SPAs) from certain types of attacks when they use the authorization `'code'` grant type. Which is our case.
   * Client generates `codeVerifier` which is a secret value and a derived value called the `codeChallenge`. The `codeVerifier` is sent with the authorization request, and the `codeChallenge` is sent with the token request.
   *
   * @returns {codeChallenge, codeVerifier}
   */
  async generatePkce() {
    // code verifier requirements: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
    const codeVerifier = generateRandomString(43);
    const data = this.encodeCodeVerifier(codeVerifier);
    // A digest is a short fixed-length value derived from some variable-length input. Cryptographic digests should exhibit collision-resistance, meaning that it's hard to come up with two different inputs that have the same digest value.
    const codeChallenge = await this.generateCodeChallengeFrom(data);

    return { codeChallenge, codeVerifier };
  }

  /**
   * @description Validates access token and ID token with OAuth server, here we are verifying other important parts of JWT tokens we've received; thing such as iss, and aud.
   */
  async verifyExchangedTokens({
    idToken,
    accessToken,
    refreshToken,
  }: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }): Promise<Promise<never | void>> {
    // Refresh token is not a JWT token, it is a hexadecimal value, thus we do not need to validate it to be a valid JWT token.
    if (!refreshToken) {
      this.loggerService.error(
        'Refresh token is missing in the response of the exchanged tokens for OAuth code!',
      );
      throw new HttpException(undefined, 503);
    }

    const jwtOfAccessToken =
      await this.getJwtOfAccessToken(accessToken);
    if (!jwtOfAccessToken) {
      this.loggerService.error('Exchanged access token is invalid!');
      throw new HttpException(undefined, 503);
    }

    const jwtOfIdToken = await this.getJwtOfIdToken(idToken);
    if (!jwtOfIdToken) {
      this.loggerService.error('Exchanged ID token is invalid!');
      throw new HttpException(undefined, 503);
    }
  }

  async register({
    email,
    groups,
    lastName,
    password,
    firstName,
    applicationId,
  }: Register): Promise<string> | never {
    const memberships = this.getMemberships(groups);

    try {
      // Passing an empty string as userId signifies that FusionAuth should create it automatically.
      const { response } = await this.fusionAuthClient.register('', {
        sendSetPasswordEmail: password ? false : true,
        skipVerification: password ? false : true,
        registration: {
          applicationId,
        },
        user: {
          email,
          lastName,
          firstName,
          memberships,
          ...(password ? { password } : {}),
          fullName: `${firstName} ${lastName}`,
          data: {
            // Here we can save meta data, or settings and other info
          },
        },
      });

      if (!response?.user || !response?.user?.id) {
        throw `[Unexpected-a3abc897fd] we do not have access to ${
          response.user ? 'user id' : 'user'
        }!`;
      }
      await this.fusionAuthClient.refreshUserSearchIndex();

      return response.user.id;
    } catch (error) {
      this.loggerService.error(error);
      this.fusionAuthErrorSerializer.duplicateEmail(error, email);
      this.fusionAuthErrorSerializer.oauthError(error);
      this.fusionAuthErrorSerializer.unknownError(error);
    }
  }

  attachExchangedTokensToResponse({
    idToken,
    response,
    accessToken,
    refreshToken,
    accessTokenExpiresIn,
  }: AttachExchangedTokensToResponse): void {
    const expiresInMs = accessTokenExpiresIn * 1_000;
    const expiresIn = (Date.now() + expiresInMs) / 1000;

    setSecureCookie(
      response,
      oauthCookieTokens.accessToken,
      accessToken,
    );
    setSecureCookie(
      response,
      oauthCookieTokens.refreshToken,
      refreshToken,
    );
    // Client application needs to communicate with backend and user's profile. Those will be handled via ID token -- that's why it is not a secure cookie.
    setCookie(response, oauthCookieTokens.idToken, idToken);
    setCookie(response, oauthCookieTokens.expiresIn, expiresIn);
  }

  private async getJwtOfIdToken(
    idToken: string,
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

    return jwtValidationResponse.response.jwt;
  }

  private getMemberships(
    groups: FusionAuthUserGroup[],
  ): GroupMember[] {
    const memberships: GroupMember[] = [];

    if (groups.includes(FusionAuthUserGroup.Admin)) {
      memberships.push({
        groupId: this.fusionAuthConfigs.fusionAuthAdminGroupId,
      });
    }

    return memberships;
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
        fusionAuthApplicationId:
          this.fusionAuthConfigs.fusionAuthApplicationId,
      });
      return false;
    }

    return true;
  }

  private areWeTheAudienceOf(audience: string) {
    return (
      audience === this.fusionAuthConfigs.fusionAuthApplicationId
    );
  }

  private didWeIssued(issuer: string) {
    return issuer === this.fusionAuthConfigs.fusionAuthIssuer;
  }

  private async generateCodeChallengeFrom(data: Uint8Array) {
    const digestedData = await crypto.subtle.digest('SHA-256', data);

    return Buffer.from(digestedData)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * @description It receives a code and returns a Uint8Array containing UTF-8 encoded text.
   */
  private encodeCodeVerifier(code: string) {
    const encoder = new TextEncoder();

    return encoder.encode(code);
  }
}

interface Register {
  email: string;
  lastName: string;
  firstName: string;
  password?: string;
  applicationId: string;
  groups: FusionAuthUserGroup[];
}
interface AttachExchangedTokensToResponse {
  idToken: string;
  accessTokenExpiresIn: number;
  response: Response;
  accessToken: string;
  refreshToken: string;
}
