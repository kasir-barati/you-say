import { LoggerService } from '@backend/logger';
import FusionAuthClient, {
  GroupMember,
} from '@fusionauth/typescript-client';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { setCookie, setSecureCookie } from '@shared';
import { Response } from 'express';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
  FUSIONAUTH_OAUTH_CALLBACK_URL,
} from '../auth.constants';
import { LoginQueryDto } from '../dtos/login-query.dto';
import { OauthCallbackCookie } from '../dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from '../dtos/oauth-callback-query.dto';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly fusionAuthConfigs: AuthModuleOptions,
    @Inject(AUTH_MODULE_FUSIONAUTH_CLIENT)
    private readonly fusionAuthClient: FusionAuthClient,
    @Inject(FUSIONAUTH_OAUTH_CALLBACK_URL)
    private readonly fusionAuthOauthCallbackUrl: string,
    private readonly fusionAuthErrorSerializer: FusionAuthErrorSerializer,
    private readonly loggerService: LoggerService,
    private readonly fusionAuthClientHelper: FusionAuthClientHelper,
  ) {}

  onModuleInit() {
    this.loggerService.setContext(AuthService.name);
  }

  async register({
    email,
    groups,
    lastName,
    firstName,
  }: {
    email: string;
    lastName?: string;
    firstName?: string;
    groups: FusionAuthUserGroup[];
  }): Promise<string> | never {
    const applicationId =
      this.fusionAuthConfigs.fusionAuthApplicationId;
    const memberships = this.getMemberships(groups);
    try {
      // Passing an empty string as userId signifies that FusionAuth should create it automatically.
      const { response } = await this.fusionAuthClient.register('', {
        sendSetPasswordEmail: true,
        registration: {
          applicationId,
        },
        user: {
          email,
          lastName,
          firstName,
          memberships,
          fullName: `${firstName} ${lastName}`,
          data: {
            // Here we can save meta data, or settings and other info
          },
        },
      });

      if (!response?.user || !response?.user?.id) {
        throw `[Unexpected-a3abc897fd] we do not have access to ${
          response.user ? 'user id' : 'user'
        }`;
      }
      await this.fusionAuthClient.refreshUserSearchIndex();

      return response.user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.fusionAuthErrorSerializer.duplicateEmail(error, email);
      this.fusionAuthErrorSerializer.fusionAuthError(error);
    }
  }

  /**
   * @description this method will modifies cookies attached to the response, add necessary search params for FusionAuth to be able to process a login request. [Their oauth login mechanism when is described here](https://fusionauth.io/articles/oauth/modern-guide-to-oauth).
   *
   * @returns login URL that user should use to be able to login
   */
  async login(
    response: Response,
    queries: LoginQueryDto,
  ): Promise<string> {
    const { clientId, redirectUrl, state } = queries;
    const newState =
      this.fusionAuthClientHelper.encodeRedirectUrlToState(
        redirectUrl,
        state,
      );
    const { codeChallenge, codeVerifier } =
      await this.fusionAuthClientHelper.generatePkce();

    setSecureCookie(response, 'codeVerifier', codeVerifier);

    const tokenExchangeUrl = `${this.fusionAuthConfigs.appBaseUrl}/auth/oauth-callback`;
    const loginRedirectUrl = this.constructOauth2LoginUrl({
      state: newState,
      clientId,
      redirectUrl: tokenExchangeUrl,
      codeChallenge,
      scope: 'openid offline_access',
    });

    return loginRedirectUrl;
  }

  async oauthCallback({
    response,
    cookies,
    queries,
  }: {
    response: Response;
    cookies: OauthCallbackCookie;
    queries: OauthCallbackQuery;
  }): Promise<string> {
    const {
      response: {
        id_token: idToken,
        expires_in: expiresIn,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    } = await this.fusionAuthClient
      .exchangeOAuthCodeForAccessTokenUsingPKCE(
        queries.code,
        this.fusionAuthConfigs.fusionAuthClientId,
        this.fusionAuthConfigs
          .fusionAuthOauthConfigurationClientSecret,
        this.fusionAuthOauthCallbackUrl,
        cookies.codeVerifier,
      )
      .catch((error) => {
        this.loggerService.error({
          message:
            'exchanging OAuth code for JWT tokens using PKCE failed!',
          error,
        });
        throw new InternalServerErrorException();
      });
    const expiresInMs = expiresIn * 1_000;
    const accessTokenExpiresIn = (Date.now() + expiresInMs) / 1000;

    await this.fusionAuthClientHelper.verifyExchangedTokens({
      idToken,
      accessToken,
      refreshToken,
    });

    setSecureCookie(response, 'app.at', accessToken);
    setSecureCookie(response, 'app.rt', refreshToken);
    // Client application needs to communicate with backend and user's profile. Those will be handled via ID token -- that's why it is not a secure cookie.
    setCookie(response, 'app.idt', idToken);
    setCookie(response, 'app.at_exp', accessTokenExpiresIn);
    // Since the cookies set in the login endpoint are `httpOnly` we cannot delete them in client side. Thus we are removing them here, [read more](https://stackoverflow.com/a/1085792/8784518).
    response.clearCookie('codeVerifier');

    const redirectUrl =
      this.fusionAuthClientHelper.decodeRedirectUrlFromState({
        state: queries.state,
        locale: queries.locale,
        userState: queries.userState,
      });

    return redirectUrl;
  }

  private constructOauth2LoginUrl({
    clientId,
    state,
    scope,
    redirectUrl,
    codeChallenge,
  }: {
    scope: string;
    clientId: string;
    redirectUrl: string;
    codeChallenge: string;
    state: string;
  }): string {
    /**
     * @description this should always be set to `'code'` for this grant. This tells the OAuth server you are using the Authorization Code grant.
     */
    const responseType = 'code';
    /**
     * @description this is an optional parameter, but because we have implemented PKCE, we must specify how PKCE `codeChallenge` parameter was created. It can either be `'plain'` or `'S256'`. We never recommend using anything except `'S256'` which uses SHA-256 secure hashing for PKCE.
     */
    const codeChallengeMethod = 'S256';
    const { fusionAuthHost } = this.fusionAuthConfigs;
    const oauth2SearchParams = new URLSearchParams({
      state,
      scope,
      client_id: clientId,
      redirect_uri: redirectUrl,
      response_type: responseType,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    });
    const loginRedirectUrl = `${fusionAuthHost}/oauth2/authorize?${oauth2SearchParams}`;

    return loginRedirectUrl;
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
}
