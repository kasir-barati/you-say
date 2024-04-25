import {
  MobileLoginRequestBody,
  MobileRegisterRequestBody,
  generateRandomString,
  getTempUser,
} from '@shared';
import { MobileAuthApi } from '../api-client';
import { cleanup } from '../utils/cleanup.util';

describe('Mobile Auth -- validation', () => {
  const mobileAuthApi: MobileAuthApi = new MobileAuthApi();

  beforeAll(async () => {
    await cleanup();
  });

  describe('POST /auth/mobile/register', () => {
    it.each<MobileRegisterRequestBody>([
      {
        email: 'ying.chen@gmail.com',
        firstName: 'Ying',
        lastName: 'Chen',
        password: 'some-2-words',
      },
      {
        email: 'alex.butz@gmail.com',
        firstName: 'Alex',
        lastName: 'Butz',
        password: 'hard 77 long',
      },
    ])(
      "should pass the validation layer when request's body is valid: %o",
      async (mobileRegisterDto) => {
        const { status } =
          await mobileAuthApi.mobileAuthControllerRegister(
            { mobileRegisterDto },
            {
              validateStatus(statusCode) {
                return statusCode > 200;
              },
            },
          );

        expect(status).not.toBe(400);
      },
    );

    it.each<MobileRegisterRequestBody>([
      {
        email: 'souma.kazuya@gmail.com',
        firstName: 'Souma',
        lastName: 'Kazuya',
        password: '',
      },
      {
        email: 'christoph.butz@gmail.com',
        firstName: 'Christoph',
        lastName: '',
        password: 'hard 77 long',
      },
      {
        email: 'julia.smith@gmail.com',
        firstName: '',
        lastName: 'Smith',
        password: generateRandomString(),
      },
      {
        email: 'caster.vargas.com',
        firstName: 'Caster',
        lastName: 'Vargas',
        password: generateRandomString(),
      },
    ])(
      "should not pass the validation layer when request's body is invalid: %o",
      async (mobileRegisterDto) => {
        const { status, data } =
          await mobileAuthApi.mobileAuthControllerRegister(
            { mobileRegisterDto },
            {
              validateStatus(statusCode) {
                return statusCode > 200;
              },
            },
          );

        expect(status).toBe(400);
        expect(data).toStrictEqual({
          message: expect.any(Array),
          timestamp: expect.any(String),
          path: '/auth/mobile/register',
        });
      },
    );
  });

  describe('POST /auth/mobile/login', () => {
    it('should pass validation layer', async () => {
      const tempUser = getTempUser();

      const { status } =
        await mobileAuthApi.mobileAuthControllerLogin({
          mobileLoginDto: {
            email: tempUser.email,
            password: tempUser.password,
          },
        });

      expect(status).not.toBe(400);
    });

    it.each<MobileLoginRequestBody>([
      {
        email: 'liscia.elfrieden@yahoo.com',
        password: '2short',
      },
      {
        email: 'liscia.com',
        password: 'long & complex',
      },
    ])(
      "should not pass validation layer when request's body is invalid: %o",
      async (mobileLoginDto) => {
        const { status } =
          await mobileAuthApi.mobileAuthControllerLogin(
            { mobileLoginDto },
            {
              validateStatus(statusCode) {
                return statusCode > 200;
              },
            },
          );

        expect(status).toBe(400);
      },
    );
  });
});
