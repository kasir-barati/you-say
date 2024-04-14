import { SinonMock, SinonMockType } from '@shared';
import { Response } from 'express';
import { AuthController } from './auth.controller';
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
    it('should generate login URL', () => {
      const loginUrl =
        'http://localhost:9011/oauth2/authorize?client_id=3c219e58-ed0e-4b18-ad48-f4f92793ae32&response_type=code&redirect_uri=%2Fadmin%2Flogin&scope=offline_access&code_challenge=WrODM4U9PJqIWr4Pw9Reu8v7Jda1Fbh_YE94JJoJ02M&code_challenge_method=S256&state=pBC42ZzFqSn49sL30td6dXUgxAkeaN7s0g1RgOgaDkA';
      authService.login.returns(loginUrl);

      const loginRedirectUrl = controller.login({} as Response);

      expect(loginRedirectUrl).toStrictEqual({
        statusCode: 302,
        url: loginUrl,
      });
      expect(authService.login.callCount).toEqual(1);
      expect(authService.login.calledWith({})).toBeTruthy();
    });

    it('should propagate error occurred in the authService.login', () => {
      authService.login.throws(new Error());

      expect(() => controller.login({} as Response)).toThrow(
        new Error(),
      );
    });
  });
});
