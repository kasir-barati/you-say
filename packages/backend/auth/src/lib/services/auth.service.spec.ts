import { LoggerService } from '@backend/logger';
import FusionAuthClient from '@fusionauth/typescript-client';
import { UnauthorizedException } from '@nestjs/common';
import { MockedEntityWithSinonStubs, SinonMock } from '@shared';
import { Response } from 'express';
import { OauthCallbackCookie } from '../dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from '../dtos/oauth-callback-query.dto';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { AuthService } from './auth.service';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';
import Sinon = require('sinon');

describe('AuthService', () => {
  let authService: AuthService;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;
  let fusionAuthConfigs: AuthModuleOptions;
  let fusionAuthClientHelper: MockedEntityWithSinonStubs<FusionAuthClientHelper>;
  let loggerService: MockedEntityWithSinonStubs<LoggerService>;

  beforeEach(() => {
    const fusionAuthErrorSerializer = new FusionAuthErrorSerializer();
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
      fusionAuthErrorSerializer,
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
    it.each<
      { userId: string } & Parameters<typeof authService.register>[0]
    >([
      {
        groups: [],
        userId: 'uuid1',
        email: 'test@te.js',
      },
      {
        groups: [],
        userId: 'uuid1',
        email: 'test@te.js',
        firstName: 'test',
        lastName: 'test',
      },
      {
        userId: 'uuid2',
        email: 'temp@te.com',
        groups: [FusionAuthUserGroup.Admin],
      },
    ])(
      'should return $userId this.fusionAuthClient.register when I call register',
      async ({ email, groups, userId, firstName, lastName }) => {
        fusionAuthClient.register.resolves({
          response: { user: { id: userId } },
        });

        const result = await authService.register({
          email,
          firstName,
          lastName,
          groups,
        });

        expect(result).toBe(userId);
      },
    );

    it.each<{ response: { user?: { id?: string } } }>([
      { response: {} },
      { response: { user: {} } },
    ])(
      'should throw an error when user or user.id does not exist in the response',
      async (mockedResponse) => {
        fusionAuthClient.register.resolves(mockedResponse);

        const result = authService.register({
          email: 't@t.com',
          groups: [],
        });

        await expect(result).rejects.toThrow();
      },
    );

    it('should throw an error when fusionAuthClient.register throws an error', async () => {
      fusionAuthClient.register.rejects();

      const result = authService.register({
        email: 't@t.com',
        groups: [],
      });

      await expect(result).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should generate a login URL', () => {
      const response = SinonMock.with<Response>({
        cookie: jest.fn(),
      });
      fusionAuthConfigs.fusionAuthClientId = 'uuid';
      fusionAuthConfigs.fusionAuthOauthScopes =
        'profile offline_access openid';

      const loginRedirectUrl = new URL(authService.login(response));

      expect(loginRedirectUrl.protocol).toBe('http:');
      expect(loginRedirectUrl.host).toBe('fusionauth:9011');
      expect(loginRedirectUrl.pathname).toBe('/oauth2/authorize');
      expect(
        loginRedirectUrl.searchParams.get('code_challenge_method'),
      ).toBe('S256');
      expect(loginRedirectUrl.searchParams.get('scope')).toBe(
        'profile offline_access openid',
      );
      expect(loginRedirectUrl.searchParams.get('response_type')).toBe(
        'code',
      );
      expect(loginRedirectUrl.searchParams.get('client_id')).toBe(
        'uuid',
      );
      expect(loginRedirectUrl.searchParams.get('state')).toEqual(
        expect.any(String),
      );
      expect(loginRedirectUrl.searchParams.get('nonce')).toEqual(
        expect.any(String),
      );
      expect(
        loginRedirectUrl.searchParams.get('redirect_uri'),
      ).toEqual(expect.any(String));
      expect(
        loginRedirectUrl.searchParams.get('code_challenge'),
      ).toEqual(expect.any(String));
    });

    it('should generate a login URL with cookies who are secure', () => {
      const response = SinonMock.with<Response>({});
      fusionAuthConfigs.appBaseUrl = 'https://you-say.com';
      fusionAuthConfigs.fusionAuthClientId = 'uuid';
      fusionAuthConfigs.fusionAuthOauthScopes =
        'profile offline_access openid';

      authService.login(response);

      expect(response.cookie.callCount).toBe(3);
      for (const cookieName of [
        'oauth_state',
        'oauth_code_verifier',
        'oauth_nonce',
      ]) {
        expect(
          response.cookie.calledWithExactly(
            cookieName,
            Sinon.match.string,
            {
              httpOnly: true,
              secure: true,
            },
          ),
        ).toBeTruthy();
      }
    });
  });

  describe('oauthCallback', () => {
    it('should return frontend URL', async () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        oauthState: '',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        state: '',
      });
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            id_token: 'idToken',
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
          },
        },
      );
      fusionAuthClientHelper.verifyExchangedTokens.resolves();
      fusionAuthConfigs.frontendUrl = 'http://localhost:3000';

      const result = await authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(result).toBe('http://localhost:3000');
    });

    it('should throw UnauthorizedException if cookies.oauthState is not equal to queries.state', () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        oauthState: 'some',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        state: 'junk',
      });

      const result = authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if fusion auth client throw an error', () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        oauthState: '',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        state: '',
      });
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.rejects();

      const result = authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should set necessary secure cookies for the response', async () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        oauthState: '',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        state: '',
      });
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            id_token: 'idToken',
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
          },
        },
      );
      fusionAuthConfigs.appBaseUrl = 'https://you-say.com';
      fusionAuthConfigs.domainOfCookie = 'localhost';

      await authService.oauthCallback({
        response,
        cookies,
        queries,
      });

      expect(response.cookie.callCount).toBe(3);
      expect(
        response.cookie.calledWithExactly(
          'access_token',
          'accessToken',
          {
            httpOnly: true,
            secure: true,
            domain: 'localhost',
          },
        ),
      ).toBeTruthy();
      expect(
        response.cookie.calledWithExactly(
          'refresh_token',
          'refreshToken',
          {
            httpOnly: true,
            secure: true,
            domain: 'localhost',
          },
        ),
      ).toBeTruthy();
      expect(
        response.cookie.calledWithExactly('id_token', 'idToken', {
          secure: true,
          domain: 'localhost',
        }),
      ).toBeTruthy();
    });

    it('should clear oauth_state, oauth_nonce, and oauth_code_verifier cookies', async () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        oauthState: '',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        state: '',
      });
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
            id_token: 'idToken',
            access_token: 'accessToken',
            refresh_token: 'refreshToken',
          },
        },
      );

      await authService.oauthCallback({ response, cookies, queries });

      expect(response.clearCookie.callCount).toEqual(3);
      for (const cookieName of [
        'oauth_state',
        'oauth_code_verifier',
        'oauth_nonce',
      ]) {
        expect(
          response.clearCookie.calledWith(cookieName),
        ).toBeTruthy();
      }
    });

    it('should propagate any error that had occurred in verifyExchangedTokens method', () => {
      const response = SinonMock.with<Response>({});
      const cookies = SinonMock.with<OauthCallbackCookie>({
        oauthState: '',
      });
      const queries = SinonMock.with<OauthCallbackQuery>({
        state: '',
      });
      fusionAuthClient.exchangeOAuthCodeForAccessTokenUsingPKCE.resolves(
        {
          response: {
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
});
