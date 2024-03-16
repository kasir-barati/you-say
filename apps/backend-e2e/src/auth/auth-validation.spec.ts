import { AuthApi } from '../api-client';
import { generateRandomString } from '../utils/generate-random-string.util';

describe('Auth', () => {
  const authApi: AuthApi = new AuthApi();

  it.each<
    Parameters<
      typeof authApi.authControllerRegister
    >[0]['registerDto']
  >([
    {
      lastName: 'Barati',
      firstName: 'Mohammad',
      email: `${generateRandomString()}@e.com`,
    },
    {
      lastName: 'Barati',
      firstName: 'Sajad',
      email: `${generateRandomString()}@e.com`,
    },
  ])('should pass the validation layer', async (registerDto) => {
    const res = await authApi.authControllerRegister(
      { registerDto },
      {
        validateStatus(statusCode) {
          return statusCode > 200;
        },
      },
    );

    expect(res.status).not.toBe(400);
  });

  it.each<
    Parameters<
      typeof authApi.authControllerRegister
    >[0]['registerDto']
  >([
    { email: 'invalid', firstName: 'Mohammad', lastName: 'valid' },
    { email: 'valid@mail.com', firstName: '', lastName: 'valid' },
    { email: 'test@valid.jp', firstName: 'Kasir', lastName: '' },
    { email: 'test@valid.jp', firstName: null, lastName: undefined },
    { email: 'test@valid.jp', firstName: '   ', lastName: '    ' },
    {
      email: 'js@ts.cn',
      firstName: 'c'.repeat(129),
      lastName: 'c',
    },
  ])('should throw 400 -- POST /register', async (registerDto) => {
    const res = await authApi.authControllerRegister(
      {
        registerDto,
      },
      {
        validateStatus(status) {
          return status >= 200;
        },
      },
    );

    expect(res.status).toBe(400);
    expect(res.data).toEqual({
      path: '/auth/register',
      message: expect.any(Array),
      timestamp: expect.any(String),
    });
  });
});
