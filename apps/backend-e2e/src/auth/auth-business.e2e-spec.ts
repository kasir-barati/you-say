import { AuthApi } from '../api-client';
import { cleanup } from '../utils/cleanup.util';

describe('Auth', () => {
  const authApi: AuthApi = new AuthApi();

  beforeAll(async () => {
    await cleanup();
  });

  it('should create a user -- POST /register', async () => {
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
      path: '/auth/register',
      timestamp: expect.any(String),
    });
  });

  it('should generate a FusionAuth login URL -- GET /login', async () => {
    const response = await authApi.authControllerLogin();
    const loginRedirectUrl = response.request.res.responseUrl;

    expect(response.status).toBe(200);
    // README: a more exhaustive test to check generate URL had been written here: packages/backend/auth/src/lib/services/auth.service.spec.ts
    expect(loginRedirectUrl).toEqual(expect.any(String));
  });
});
