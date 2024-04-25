import { TokenType } from '@fusionauth/typescript-client';
import { MockedEntityWithSinonStubs, SinonMock } from '@shared';
import { MobileLoginResponseDto } from '../dtos/mobile-login-response.dto';
import { MobileLoginDto } from '../dtos/mobile-login.dto';
import { MobileRegisterDto } from '../dtos/mobile-register.dto';
import { MobileAuthService } from '../services/mobile-auth.service';
import { MobileAuthController } from './mobile-auth.controller';

describe('MobileAuthController', () => {
  let controller: MobileAuthController;
  let mobileAuthService: MockedEntityWithSinonStubs<MobileAuthService>;

  beforeEach(() => {
    mobileAuthService = SinonMock.of(MobileAuthService);
    controller = new MobileAuthController(mobileAuthService);
  });

  describe('register', () => {
    it('should register user', async () => {
      const mobileRegisterDto: MobileRegisterDto = {
        email: 'bao.wu@gmail.com',
        password: 'hard-2-guess',
        firstName: 'Bao',
        lastName: 'Wu',
      };
      mobileAuthService.register
        .withArgs({
          ...mobileRegisterDto,
          groups: [],
        })
        .resolves('user-oauth-server-uuid');

      const result = controller.register(mobileRegisterDto);

      expect(result).resolves.toBeUndefined();
    });

    it('should propagate errors occurred in mobileAuthService.register', async () => {
      mobileAuthService.register.rejects(new Error());

      const result = controller.register({
        email: 'ying.cheng@gmail.com',
        password: 'another-pass',
        firstName: 'Ying',
        lastName: 'Cheng',
      });

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const mobileLoginDto: MobileLoginDto = {
        email: 'xiu.du@gmail.com',
        password: 'some-pass',
      };
      mobileAuthService.login.withArgs(mobileLoginDto).resolves({
        idToken: 'id-token',
        tokenType: TokenType.Bearer,
        accessTokenExpiresIn: 1000,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      } as MobileLoginResponseDto);

      const result = await controller.login(mobileLoginDto);

      expect(result).toStrictEqual({
        idToken: 'id-token',
        tokenType: TokenType.Bearer,
        accessTokenExpiresIn: 1000,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should propagate errors occurred in mobileAuthService.login', async () => {
      mobileAuthService.login.rejects(new Error());

      const result = controller.login({
        email: 'bao.du@gmail.com',
        password: '<PASSWORD>',
      });

      expect(result).rejects.toThrow(Error);
    });
  });
});
