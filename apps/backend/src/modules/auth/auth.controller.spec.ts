import { SinonMock, SinonMockType } from '@shared';
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
});
