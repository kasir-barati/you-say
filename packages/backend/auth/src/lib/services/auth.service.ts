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
import {
  MeResponse,
  oauthCookieTokens,
  setCookie,
  setSecureCookie,
} from '@shared';
import { Response } from 'express';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
  FUSIONAUTH_OAUTH_CALLBACK_URL,
} from '../auth.constants';
import { LoginQueryDto } from '../dtos/login-query.dto';
import { LogoutQueryDto } from '../dtos/logout-query.dto';
import { MeCookieDto } from '../dtos/me-cookie.dto';
import { OauthCallbackCookie } from '../dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from '../dtos/oauth-callback-query.dto';
import { RefreshCookieDto } from '../dtos/refresh-cookie.dto';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly scope = 'openid offline_access';
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

    const tokenExchangeUrl = new URL(
      '/auth/oauth-callback',
      this.fusionAuthConfigs.appBaseUrl,
    ).toString();
    const loginRedirectUrl = this.constructOauth2LoginUrl({
      state: newState,
      clientId,
      redirectUrl: tokenExchangeUrl,
      codeChallenge,
      scope: this.scope,
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

    this.attachExchangedTokensToResponse({
      idToken,
      response,
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
    });
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

  async me(cookies: MeCookieDto): Promise<MeResponse> {
    const { response } =
      await this.fusionAuthClient.retrieveUserInfoFromAccessToken(
        cookies.accessToken,
      );

    return response as MeResponse;
  }

  logout(response: Response, queries: LogoutQueryDto) {
    const idToken = response.req.cookies[oauthCookieTokens.idToken];
    const { clientId, postLogoutRedirectUrl } = queries;

    response.clearCookie(oauthCookieTokens.accessToken);
    response.clearCookie(oauthCookieTokens.refreshToken);
    response.clearCookie(oauthCookieTokens.idToken);
    response.clearCookie(oauthCookieTokens.expiresIn);

    const logoutUrl = this.constructLogoutUrl({
      clientId,
      idToken,
      postLogoutRedirectUrl,
    });

    return logoutUrl;
  }

  async refresh(response: Response, cookies: RefreshCookieDto) {
    const {
      response: {
        access_token: accessToken,
        id_token: idToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      },
    } = await this.fusionAuthClient
      .exchangeRefreshTokenForAccessToken(
        cookies.refreshToken,
        this.fusionAuthConfigs.fusionAuthClientId,
        this.fusionAuthConfigs
          .fusionAuthOauthConfigurationClientSecret,
        this.scope,
        null,
      )
      .catch((error) => {
        this.loggerService.error({
          message:
            'Could not exchange the refresh token for an access token',
          error,
        });
        throw new InternalServerErrorException();
      });

    await this.fusionAuthClientHelper.verifyExchangedTokens({
      idToken,
      accessToken,
      refreshToken,
    });

    const expiresInMs = expiresIn * 1_000;
    const accessTokenExpiresIn = (Date.now() + expiresInMs) / 1000;

    this.attachExchangedTokensToResponse({
      idToken,
      response,
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
    });
  }

  private attachExchangedTokensToResponse({
    idToken,
    response,
    accessToken,
    refreshToken,
    accessTokenExpiresIn,
  }: {
    idToken: string;
    response: Response;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
  }) {
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
    setCookie(
      response,
      oauthCookieTokens.expiresIn,
      accessTokenExpiresIn,
    );
  }

  private constructLogoutUrl({
    clientId,
    idToken,
    postLogoutRedirectUrl,
  }: {
    idToken?: string;
    clientId?: string;
    postLogoutRedirectUrl: string;
  }): string {
    const url = new URL(
      '/oauth2/logout',
      this.fusionAuthConfigs.fusionAuthHost,
    );
    url.searchParams.append(
      'post_logout_redirect_uri',
      postLogoutRedirectUrl,
    );

    if (clientId) {
      url.searchParams.append('client_id', clientId);
    } else {
      url.searchParams.append('id_token_hint', idToken);
    }

    return url.toString();
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
    const url = new URL(
      '/oauth2/authorize',
      this.fusionAuthConfigs.fusionAuthHost,
    );

    url.searchParams.append('state', state);
    url.searchParams.append('scope', scope);
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUrl);
    url.searchParams.append('response_type', responseType);
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append(
      'code_challenge_method',
      codeChallengeMethod,
    );

    return url.toString();
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
