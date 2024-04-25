import { TokenType } from '@fusionauth/typescript-client';
import {
  MobileLoginRequestBody,
  MobileLoginResponse,
  MobileRegisterRequestBody,
  generateRandomString,
  getTempUser,
} from '@shared';
import { MobileAuthApi } from '../api-client';
import { cleanup } from '../utils/cleanup.util';

describe('Mobile Auth -- business', () => {
  const mobileAuthApi: MobileAuthApi = new MobileAuthApi();

  beforeAll(async () => {
    await cleanup();
  });

  describe('POST /auth/mobile/register', () => {
    it('should register user', async () => {
      const mobileRegisterDto: MobileRegisterRequestBody = {
        email: 'ying.wu@huawei.com',
        firstName: 'Ying',
        lastName: 'Wu',
        password: generateRandomString(),
      };

      const { status } =
        await mobileAuthApi.mobileAuthControllerRegister({
          mobileRegisterDto,
        });

      expect(status).toBe(201);
    });

    it('should not register user if email is duplicate', async () => {
      const tempUser = getTempUser();

      const { status, data } =
        await mobileAuthApi.mobileAuthControllerRegister(
          {
            mobileRegisterDto: {
              email: tempUser.email,
              firstName: 'Robert',
              lastName: 'Miller',
              password: generateRandomString(),
            },
          },
          {
            validateStatus(statusCode) {
              return statusCode > 200;
            },
          },
        );

      expect(status).toBe(400);
      expect(data['message']).toBe(
        `Email already exists: ${tempUser.email}`,
      );
    });
  });

  describe('POST /auth/mobile/login', () => {
    it('should be able to exchange credentials for tokens', async () => {
      const tempUser = getTempUser();

      const { status, data } =
        await mobileAuthApi.mobileAuthControllerLogin({
          mobileLoginDto: {
            email: tempUser.email,
            password: tempUser.password,
          },
        });

      expect(status).toBe(200);
      expect(data).toStrictEqual({
        accessToken: expect.any(String),
        accessTokenExpiresIn: expect.any(Number),
        idToken: expect.any(String),
        refreshToken: expect.any(String),
        tokenType: TokenType.Bearer,
      } as MobileLoginResponse);
    });

    it('should not get tokens when credentials are not valid', async () => {
      const tempUser = getTempUser();
      const mobileLoginDto: MobileLoginRequestBody = {
        email: tempUser.email,
        password: generateRandomString(),
      };

      const { status, data } =
        await mobileAuthApi.mobileAuthControllerLogin(
          { mobileLoginDto },
          {
            validateStatus(statusCode) {
              return statusCode > 200;
            },
          },
        );

      expect(status).toBe(400);
      expect(data).toStrictEqual({
        message: 'The user credentials are invalid.',
        timestamp: expect.any(String),
        path: '/auth/mobile/login',
      });
    });
  });
});
