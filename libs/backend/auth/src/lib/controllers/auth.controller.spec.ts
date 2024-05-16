import {
  SinonMock,
  SinonMockType,
  generateRandomString,
} from '@shared';
import { Response } from 'express';
import { LoginQueryDto } from '../dtos/login-query.dto';
import { LogoutQueryDto } from '../dtos/logout-query.dto';
import { MeCookieDto } from '../dtos/me-cookie.dto';
import { OauthCallbackCookie } from '../dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from '../dtos/oauth-callback-query.dto';
import { RefreshCookieDto } from '../dtos/refresh-cookie.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: SinonMockType<AuthService>;

  beforeEach(() => {
    authService = SinonMock.of<AuthService>(AuthService);
    controller = new AuthController(authService);
  });

  describe('POST /register', () => {
    it('should register a user', async () => {
      const registerDto: RegisterDto = {
        email: 'xin.chen@byd.com',
        firstName: 'Xing',
        lastName: 'Chen',
      };
      authService.register.withArgs(registerDto).resolves('uuid');

      const result = controller.register(registerDto);

      expect(result).resolves.toBeUndefined();
    });

    it('should propagate errors occurred in authService.register', async () => {
      authService.register.rejects(new Error());

      const result = controller.register({
        email: 'ying.chen@byd.com',
        firstName: 'Ying',
        lastName: 'Chen',
      });

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('GET /login', () => {
    it('should generate login URL', async () => {
      const loginUrl =
        'http://localhost:9011/oauth2/authorize?state=aHR0cDovL2xvY2FsaG9zdDozMDAw%3A%2Fposts&scope=openid+offline_access&client_id=b94471aa-bc85-4538-b1a8-e3c4642c9c8b&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Foauth-callback&response_type=code&code_challenge=ehCJNHDlbPRoZmVShA5YWxqa1oVI-qmfcout3iAf6KU&code_challenge_method=S256';
      authService.login.resolves(loginUrl);

      const loginRedirectUrl = await controller.login(
        {} as Response,
        {} as LoginQueryDto,
      );

      expect(loginRedirectUrl).toStrictEqual({
        statusCode: 302,
        url: loginUrl,
      });
      expect(authService.login.callCount).toEqual(1);
      expect(authService.login.calledWith({})).toBeTruthy();
    });

    it('should propagate error occurred in the authService.login', () => {
      authService.login.rejects(new Error());

      const loginRedirectUrl = controller.login(
        {} as Response,
        {} as LoginQueryDto,
      );

      expect(loginRedirectUrl).rejects.toThrow(new Error());
    });
  });

  describe('GET /oauth-callback', () => {
    it('should redirect user to the frontend app', async () => {
      const frontendUrl = 'http://localhost:3000';
      authService.oauthCallback.resolves(frontendUrl);

      const result = await controller.oauthCallback(
        { cookie: {} } as Response,
        { codeVerifier: '' } as OauthCallbackCookie,
        { code: '' } as OauthCallbackQuery,
      );

      expect(result).toStrictEqual({
        statusCode: 302,
        url: frontendUrl,
      });
      expect(authService.oauthCallback.callCount).toEqual(1);
      expect(
        authService.oauthCallback.calledWith({
          response: { cookie: {} },
          cookies: { codeVerifier: '' },
          queries: { code: '' },
        }),
      ).toBeTruthy();
    });

    it('should propagate errors occurred in the authService.oauthCallback', () => {
      authService.oauthCallback.rejects(new Error());

      const result = controller.oauthCallback(
        {} as Response,
        {} as OauthCallbackCookie,
        {} as OauthCallbackQuery,
      );

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('GET /me', () => {
    it('should return user info returned from auth service', async () => {
      const cookies: MeCookieDto = { accessToken: '' };
      const userInfo = { sub: '' };
      authService.me.withArgs(cookies).resolves(userInfo);

      const result = await controller.me(cookies);

      expect(result).toStrictEqual(userInfo);
    });

    it('should propagate error occurred in authService.me', () => {
      const cookies: MeCookieDto = { accessToken: '' };
      authService.me.rejects(new Error());

      const result = controller.me(cookies);

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('GET /logout', () => {
    it.each<LogoutQueryDto>([
      {
        clientId: 'uuid',
        postLogoutRedirectUrl: 'http://localhost:3000',
      },
      {
        postLogoutRedirectUrl: 'http://localhost:3000',
      },
    ])('should return logout url', (queries) => {
      const response = {} as Response;
      authService.logout
        .withArgs(response, queries)
        .returns('http://localhost:9011/oauth2/logout');

      const result = controller.logout(response, queries);

      expect(result).toStrictEqual({
        statusCode: 302,
        url: 'http://localhost:9011/oauth2/logout',
      });
    });

    it('should propagate errors occurred in authService.logout', () => {
      const response = {} as Response;
      const queries = {} as LogoutQueryDto;

      authService.logout
        .withArgs(response, queries)
        .throws(new Error());

      expect(() => controller.logout(response, queries)).toThrow(
        Error,
      );
    });
  });

  describe('POST /refresh', () => {
    it('should return nothing', async () => {
      const cookies: RefreshCookieDto = {
        refreshToken: generateRandomString(),
      };
      const response = {} as Response;
      authService.refresh.withArgs(response, cookies).resolves();

      const result = await controller.refresh(response, cookies);

      expect(result).toBeUndefined();
    });

    it('should propagate errors occurred in authService.refresh', () => {
      const cookies: RefreshCookieDto = {
        refreshToken: '',
      };
      const response = {} as Response;
      authService.refresh
        .withArgs(response, cookies)
        .rejects(new Error());

      const result = controller.refresh(response, cookies);

      expect(result).rejects.toThrow(Error);
    });
  });
});
