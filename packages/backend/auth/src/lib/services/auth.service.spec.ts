import { LoggerService } from '@backend/logger';
import FusionAuthClient from '@fusionauth/typescript-client';
import { InternalServerErrorException } from '@nestjs/common';
import {
  MeResponse,
  MockedEntityWithSinonStubs,
  SinonMock,
  oauthCookieTokens,
} from '@shared';
import { Response } from 'express';
import * as Sinon from 'sinon';
import { LoginQueryDto } from '../dtos/login-query.dto';
import { LogoutQueryDto } from '../dtos/logout-query.dto';
import { MeCookieDto } from '../dtos/me-cookie.dto';
import { OauthCallbackCookie } from '../dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from '../dtos/oauth-callback-query.dto';
import { RefreshCookieDto } from '../dtos/refresh-cookie.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthModuleOptions } from '../types/auth.type';
import { AuthService } from './auth.service';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';

describe('AuthService', () => {
  let authService: AuthService;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;
  let fusionAuthConfigs: AuthModuleOptions;
  let fusionAuthClientHelper: MockedEntityWithSinonStubs<FusionAuthClientHelper>;
  let loggerService: MockedEntityWithSinonStubs<LoggerService>;

  beforeEach(() => {
    fusionAuthConfigs = {
      appBaseUrl: 'http:localhost:3001',
      fusionAuthHost: 'http://fusionauth:9011',
      fusionAuthApplicationId: 'uuid',
      fusionAuthAdminGroupId: 'uuid',
    } as AuthModuleOptions;
    loggerService = SinonMock.of(LoggerService);
    fusionAuthClient = SinonMock.of(FusionAuthClient);
    fusionAuthClientHelper = SinonMock.of(FusionAuthClientHelper);
    authService = new AuthService(
      fusionAuthConfigs,
      fusionAuthClient,
      'http://localhost:3001/auth/oauth-callback',
      loggerService,
      fusionAuthClientHelper,
    );
  });

  it('should set context of logger service on module init', () => {
    authService.onModuleInit();

    expect(loggerService.setContext.callCount).toEqual(1);
    expect(
      loggerService.setContext.calledWith(AuthService.name),
    ).toBeTruthy();
  });

  describe('register', () => {
    it.each<RegisterDto>([
      {
        email: 'email@exam.js',
        firstName: 'Mohammad',
        lastName: 'Barati',
      },
      {
        email: 'sum@sun.com',
        firstName: 'Sun',
        lastName: 'sunny',
      },
    ])('should return userId', async (registerDto) => {
      fusionAuthConfigs.fusionAuthApplicationId = 'app-uuid';
      fusionAuthClientHelper.register
        .withArgs({
          groups: [],
          ...registerDto,
          applicationId: 'app-uuid',
        })
        .resolves('user-uuid');

      const result = await authService.register({
        groups: [],
        ...registerDto,
      });

      expect(result).toEqual('user-uuid');
    });

    it('should propagate errors occurred in fusionAuthClientHelper.register', async () => {
      fusionAuthClientHelper.register.rejects(new Error());

      const result = authService.register({
        groups: [],
        email: 'alex@butz.com',
        firstName: 'Alex',
        lastName: 'butz',
      });

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    it('should generate a login URL', async () => {
      const response = SinonMock.with<Response>({
        cookie: jest.fn(),
      });
      const queries: LoginQueryDto = {
        state: '/posts',
        clientId: 'uuid',
        redirectUrl: 'http://localhost:3000',
      };
      fusionAuthClientHelper.encodeRedirectUrlToState.returns(
        'aHR0cDovL2xvY2FsaG9zdDozMDAwLw==:/posts',
      );
      fusionAuthClientHelper.generatePkce.resolves({
        codeChallenge: '0zBVTVGBnbqkUpbFXJbRewNmXn4ZCECfZYv792oo1LU',
        codeVerifier: 'wuruazmrvvteawaflktmzxyw_gwmt-yz',
      });

      const result = await authService.login(response, queries);
      const loginRedirectUrl = new URL(result);

      expect(loginRedirectUrl.protocol).toBe('http:');
      expect(loginRedirectUrl.host).toBe('fusionauth:9011');
      expect(loginRedirectUrl.pathname).toBe('/oauth2/authorize');
      expect(
        Object.fromEntries(loginRedirectUrl.searchParams),
      ).toMatchObject({
        client_id: 'uuid',
        response_type: 'code',
        code_challenge_method: 'S256',
        scope: 'openid offline_access',
        state: 'aHR0cDovL2xvY2FsaG9zdDozMDAwLw==:/posts',
        redirect_uri: 'http://localhost:3001/auth/oauth-callback',
        code_challenge: '0zBVTVGBnbqkUpbFXJbRewNmXn4ZCECfZYv792oo1LU',
      });
    });

    it('should generate a login URL with cookies who are secure', async () => {
      const response = SinonMock.with<Response>({
        req: { protocol: 'https' },
      });
      fusionAuthConfigs.fusionAuthApplicationId = 'uuid';
      fusionAuthClientHelper.generatePkce.resolves({
        codeChallenge: 'JR-vKNlVo4G1RPdQ2ItHcgdAYIpUr1HJuXr2hH6QIw4',
        codeVerifier: 'xqzmumbrxyzqpcj-oxznpmpclbgealhavbsabh_ibkn',
      });

      await authService.login(response, {
        state: '/posts',
        clientId: 'uuid',
        redirectUrl: 'http://localhost:3000',
      });

      expect(response.cookie.callCount).toBe(1);
      expect(
        response.cookie.calledWithExactly(
          'codeVerifier',
          Sinon.match.string,
          {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
          },
        ),
      ).toBeTruthy();
    });
  });

  describe('oauthCallback', () => {
    it('should return frontend URL', async () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        codeVerifier: '',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        code: '',
        locale: 'en',
        userState: 'Authenticated',
        state: 'aHR0cHM6Ly95b3Utc2F5LmNvbS8=:/posts',
      });
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            expires_in: 12,
            id_token: 'idToken-jwt',
            access_token: 'accessToken-jwt',
            refresh_token: 'refresh token',
          },
        },
      );
      fusionAuthClientHelper.verifyExchangedTokens.resolves();
      fusionAuthClientHelper.decodeRedirectUrlFromState.resolves(
        'https://you-say.com',
      );

      const result = await authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(result).toBe('https://you-say.com');
    });

    it('should throw InternalServerErrorException if fusionAuthClient could not exchange code for tokens', () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({});
      const queries = SinonMock.with<OauthCallbackQuery>({});
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.rejects();

      const result = authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should set necessary cookies for the response', async () => {
      const response = SinonMock.with<Response>({
        req: { protocol: 'https' },
      });
      const cookies = SinonMock.with<OauthCallbackCookie>({});
      const queries = SinonMock.with<OauthCallbackQuery>({});
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            expires_in: 5,
            id_token: 'idToken',
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
          },
        },
      );

      await authService.oauthCallback({
        response,
        cookies,
        queries,
      });
    });

    it('should clear codeVerifier cookies', async () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({});
      const queries = SinonMock.with<OauthCallbackQuery>({});
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            expires_in: 14,
            id_token: 'idToken',
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
          },
        },
      );

      await authService.oauthCallback({ response, cookies, queries });

      expect(response.clearCookie.callCount).toEqual(1);
      expect(
        response.clearCookie.calledWith('codeVerifier'),
      ).toBeTruthy();
    });

    it('should propagate any error that had occurred in verifyExchangedTokens method', () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({});
      const queries = SinonMock.with<OauthCallbackQuery>({});
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            expires_in: 29,
            id_token: 'idToken',
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
          },
        },
      );
      fusionAuthClientHelper.verifyExchangedTokens.rejects(
        new Error(),
      );

      const result = authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('me', () => {
    it('should return user info', async () => {
      const cookies: MeCookieDto = { accessToken: '' };
      const response: MeResponse = {
        applicationId: 'uuid',
        email: 'email',
        email_verified: true,
        family_name: 'family',
        given_name: 'name',
        preferred_username: 'email',
        roles: [],
        scope: 'openid offline_access',
        settings: {},
        sid: 'uuid',
        sub: 'uuid',
        tenant: {},
        tid: 'uuid',
      };
      fusionAuthClient.retrieveUserInfoFromAccessToken
        .withArgs(cookies.accessToken)
        .resolves({
          response,
        });

      const result = await authService.me(cookies);

      expect(result).toStrictEqual(response);
    });

    it('should propagate errors thrown at fusionAuthClient.retrieveUserInfoFromAccessToken', () => {
      fusionAuthClient.retrieveUserInfoFromAccessToken.rejects(
        new Error(),
      );

      const result = authService.me({ accessToken: '' });

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('logout', () => {
    let response: MockedEntityWithSinonStubs<Response>;

    beforeEach(() => {
      response = SinonMock.with<Response>({ req: { cookies: {} } });
    });

    it.each<string>(['https://you-say.com', 'http://localhost:3000'])(
      'should return logout url',
      (postLogoutRedirectUrl) => {
        const queries: LogoutQueryDto = { postLogoutRedirectUrl };
        response.req.cookies[oauthCookieTokens.idToken] =
          'jwt-id-token';
        fusionAuthConfigs.fusionAuthHost = 'http://localhost:9011';
        const searchParams = new URLSearchParams();
        searchParams.append(
          'post_logout_redirect_uri',
          postLogoutRedirectUrl,
        );
        searchParams.append('id_token_hint', 'jwt-id-token');

        const result = authService.logout(response, queries);

        expect(result).toBe(
          `${fusionAuthConfigs.fusionAuthHost}/oauth2/logout?${searchParams}`,
        );
      },
    );

    it('should clear OAuth related cookies', () => {
      const queries: LogoutQueryDto = {
        postLogoutRedirectUrl: 'http://localhost:3000',
      };
      response.req.cookies[oauthCookieTokens.idToken] =
        'jwt-id-token';
      fusionAuthConfigs.fusionAuthHost = 'http://localhost:9011';

      authService.logout(response, queries);

      expect(response.clearCookie.callCount).toEqual(4);
      expect(
        response.clearCookie.calledWithExactly(
          oauthCookieTokens.accessToken,
        ),
      ).toBeTruthy();
      expect(
        response.clearCookie.calledWithExactly(
          oauthCookieTokens.refreshToken,
        ),
      ).toBeTruthy();
      expect(
        response.clearCookie.calledWithExactly(
          oauthCookieTokens.idToken,
        ),
      ).toBeTruthy();
      expect(
        response.clearCookie.calledWithExactly(
          oauthCookieTokens.expiresIn,
        ),
      ).toBeTruthy();
    });

    it.each<string>(['uuid', 'another-uuid'])(
      'should add client_id when it is set in query params',
      (clientId) => {
        const queries: LogoutQueryDto = {
          clientId,
          postLogoutRedirectUrl: 'https://you-say.com',
        };
        response.req.cookies = {
          [oauthCookieTokens.idToken]: 'jwt-id-token',
        };

        const logoutUrl = authService.logout(response, queries);

        expect(logoutUrl).toContain(`client_id=${clientId}`);
        expect(logoutUrl).not.toContain(`id_token_hint`);
      },
    );

    it.each<string>(['jwt-id-token', 'jwt-id-token1'])(
      'should add id_token_hint when client_id has is not in query params',
      (idToken) => {
        const queries: LogoutQueryDto = {
          postLogoutRedirectUrl: 'https://you-say.com',
        };
        response.req.cookies = {
          [oauthCookieTokens.idToken]: idToken,
        };

        const logoutUrl = authService.logout(response, queries);

        expect(logoutUrl).toContain(`id_token_hint=${idToken}`);
        expect(logoutUrl).not.toContain(`client_id`);
      },
    );
  });

  describe('refresh', () => {
    let response: MockedEntityWithSinonStubs<Response>;

    beforeEach(() => {
      response = SinonMock.with<Response>({
        req: { protocol: 'https' },
      });
    });

    it('should throw InternalServerErrorException if it could not exchange refresh token for new tokens', () => {
      const cookies: RefreshCookieDto = { refreshToken: '' };
      fusionAuthConfigs.fusionAuthApplicationId = 'client-uuid';
      fusionAuthConfigs.fusionAuthOauthConfigurationClientSecret =
        'secret';
      fusionAuthClient.exchangeRefreshTokenForAccessToken
        .withArgs(
          cookies.refreshToken,
          fusionAuthConfigs.fusionAuthApplicationId,
          fusionAuthConfigs.fusionAuthOauthConfigurationClientSecret,
          'openid offline_access',
          null,
        )
        .rejects(Error);

      const result = authService.refresh(response, cookies);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should attach new tokens to the response cookies', async () => {
      const cookies = SinonMock.with<RefreshCookieDto>({});
      fusionAuthClient.exchangeRefreshTokenForAccessToken.resolves({
        response: {
          expires_in: 5,
          id_token: 'idToken',
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
        },
      });

      await authService.refresh(response, cookies);
    });

    it('should propagate any error that had occurred in verifyExchangedTokens method', () => {
      const cookies = SinonMock.with<RefreshCookieDto>({});
      fusionAuthClient.exchangeRefreshTokenForAccessToken.resolves({
        response: {
          expires_in: 29,
          id_token: 'idToken',
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
        },
      });
      fusionAuthClientHelper.verifyExchangedTokens.rejects(
        new Error(),
      );

      const result = authService.refresh(response, cookies);

      expect(result).rejects.toThrow(Error);
    });
  });
});
