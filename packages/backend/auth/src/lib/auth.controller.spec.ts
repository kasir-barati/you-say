import { SinonMock, SinonMockType } from '@shared';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { LoginQueryDto } from './dtos/login-query.dto';
import { OauthCallbackCookie } from './dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from './dtos/oauth-callback-query.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: SinonMockType<AuthService>;

  beforeEach(() => {
    authService = SinonMock.of<AuthService>(AuthService);
    controller = new AuthController(authService);
  });

  describe('POST /register', () => {
    it.each<RegisterDto>([
      {
        email: 'email@email.com',
        firstName: 'first name1',
        lastName: 'last name1',
      },
      {
        email: 'test@test.com',
        firstName: 'first name2',
        lastName: 'last name2',
      },
    ])('should register a user', async (registerDto) => {
      authService.register.resolves('uuid');

      await controller.register(registerDto);

      expect(authService.register.callCount).toEqual(1);
      expect(
        authService.register.calledWith({
          ...registerDto,
          groups: [],
        }),
      ).toBeTruthy();
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
});
