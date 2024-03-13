import { AuthApi } from '../api-client';
import { cleanup } from '../utils/cleanup.util';

describe('Auth', () => {
  const authApi: AuthApi = new AuthApi();

  beforeAll(async () => {
    await cleanup();
  });

  it.only('should create a user -- POST /register', async () => {
    const res = await authApi.authControllerRegister({
      registerDto: {
        email: `e${Date.now().toString()}@mail.js`,
        firstName: 'name',
        lastName: 'family',
      },
    });

    expect(res.status).toBe(201);
  });

  it('should throw 400 error when email is already taken -- POST /register', async () => {
    const email = 'duplicate@dup.com';
    const res1 = await authApi.authControllerRegister({
      registerDto: {
        email,
        firstName: 'first',
        lastName: 'last',
      },
    });
    const res2 = await authApi.authControllerRegister(
      {
        registerDto: {
          email,
          firstName: 'first',
          lastName: 'last',
        },
      },
      {
        validateStatus(statusCode) {
          return statusCode >= 400;
        },
      },
    );

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(400);
    expect(res2.data).toStrictEqual({
      message: `Email already exists: ${email}`,
    });
  });
});
