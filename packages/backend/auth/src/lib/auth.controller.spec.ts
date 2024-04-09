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
      // TODO: replace empty string with a real example
      authService.login.returns('');

      const loginRedirectUrl = controller.login({} as Response);

      expect(loginRedirectUrl).toStrictEqual({
        statusCode: 302,
        url: '',
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
