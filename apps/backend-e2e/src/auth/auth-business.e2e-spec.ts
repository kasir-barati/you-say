import {
  generateRandomString,
  getTempUser,
  oauthCookieTokens,
} from '@shared';
import {
  AuthApi,
  AuthApiAuthControllerLogoutRequest,
} from '../api-client';
import { cleanup } from '../utils/cleanup.util';
import {
  FRONTEND_URL,
  FUSIONAUTH_APPLICATION_ID,
  FUSIONAUTH_TENANT_ID,
} from '../utils/env-variables.util';
import { login } from '../utils/login.util';

describe('Auth -- business', () => {
  const authApi: AuthApi = new AuthApi();

  beforeAll(async () => {
    await cleanup();
  });

  describe('POST /register', () => {
    it('should create a user', async () => {
      const res = await authApi.authControllerRegister({
        registerDto: {
          email: `e${Date.now().toString()}@mail.js`,
          firstName: 'name',
          lastName: 'family',
        },
      });

      expect(res.status).toBe(201);
    });

    it('should throw 400 error when email is already taken', async () => {
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
  });

  describe('GET /login', () => {
    it('should generate a FusionAuth login URL', async () => {
      const response = await authApi.authControllerLogin({
        state: '/posts',
        redirectUri: FRONTEND_URL,
        clientId: FUSIONAUTH_APPLICATION_ID,
      });
      const loginRedirectUrl = response.request.res.responseUrl;

      expect(response.status).toBe(200);
      // README: a more exhaustive test to check generate URL had been written here: packages/backend/auth/src/lib/services/auth.service.spec.ts
      expect(loginRedirectUrl).toEqual(expect.any(String));
    });
  });

  describe('GET /oauth-callback', () => {
    /**
     * @readme Since we have a good coverage in unit tests we did not check the other cases. It is also noteworthy to mention that it is not feasible and reasonable to do it; we do not need to test a 3rd party tool (OAuth server).
     * It is also not viable to test the OAuth flow in e2e tests since it requires real user interaction with the browser, we will cover this part in Cypress.
     */

    it('should throw 500 when code/codeVerifier is not valid', async () => {
      const { status } = await authApi.authControllerOauthCallback(
        {
          locale: 'en',
          userState: 'Authenticated',
          state:
            'HR0cDovL2xvY2FsaG9zdDozMDAw%3Aa3589a11ef6a19f9c77b78456604a4ed0c372a379a17007bc2471136%3A',
          code: 'md2lLzEDsv2bPePUOlV0mudVhHmRCGInM67At9wB3Ew',
        },
        {
          headers: {
            Cookie: `codeVerifier=wuruazmrvvteawaflktmzxyw_gwmt-yz`,
          },
          validateStatus(statusCode) {
            return statusCode > 200;
          },
        },
      );

      expect(status).toEqual(500);
    });
  });

  describe('GET /auth/me', () => {
    it('should return user info.', async () => {
      const tempUser = getTempUser();
      const authenticationResult = await login({
        username: tempUser.email,
        password: tempUser.password,
      });
      const { status, data } = await authApi.authControllerMe({
        headers: authenticationResult.headers,
        validateStatus(statusCode) {
          return statusCode >= 200;
        },
      });

      expect(status).toEqual(200);
      expect(data).toStrictEqual({
        applicationId: FUSIONAUTH_APPLICATION_ID,
        email: 'souma.kazuya@you-say.com',
        email_verified: true,
        family_name: 'Kazuya',
        given_name: 'Souma',
        preferred_username: 'souma.kazuya@you-say.com',
        roles: [],
        scope: 'openid offline_access',
        settings: {},
        sid: expect.any(String),
        sub: expect.any(String),
        tenant: {},
        tid: FUSIONAUTH_TENANT_ID,
      });
    });
  });

  describe('GET /auth/logout', () => {
    it.each<AuthApiAuthControllerLogoutRequest>([
      {
        postLogoutRedirectUri: 'http://localhost:3000',
      },
      {
        postLogoutRedirectUri: 'https://you-say.com',
        clientId: FUSIONAUTH_APPLICATION_ID,
      },
    ])('should logout', async (queries) => {
      const tempUser = getTempUser();
      const authenticationResult = await login({
        username: tempUser.email,
        password: tempUser.password,
      });
      const searchParams = new URLSearchParams();
      searchParams.append(
        'post_logout_redirect_uri',
        queries.postLogoutRedirectUri,
      );
      if (queries.clientId) {
        searchParams.append('client_id', queries.clientId);
      } else {
        searchParams.append(
          'id_token_hint',
          authenticationResult.idToken,
        );
      }

      const { status, headers } = await authApi.authControllerLogout(
        queries,
        {
          headers: authenticationResult.headers,
          validateStatus(status) {
            return status >= 200;
          },
          maxRedirects: 0,
        },
      );

      expect(status).toEqual(302);
      expect(headers.location).toBe(
        `http://localhost:9011/oauth2/logout?${searchParams}`,
      );
    });
  });

  describe('POST /auth/refresh', () => {
    // TODO: Fix this test, why it stucks when it calls authControllerRefresh but if I remove login step it'll work? :/
    it.skip('should refresh tokens', async () => {
      const tempUser = getTempUser();
      const authenticationResult = await login({
        username: tempUser.email,
        password: tempUser.password,
      });
      const { status, headers, data } =
        await authApi.authControllerRefresh({
          headers: authenticationResult.headers,
          validateStatus(status) {
            return status >= 200;
          },
        });

      console.log(data, status);

      expect(status).toEqual(204);
      expectNewCookies(
        authenticationResult.headers.Cookie,
        headers.Cookie,
      );
    });

    it('should fail when refresh token is not generated by OAuth server', async () => {
      const refreshToken = generateRandomString();

      const { status } = await authApi.authControllerRefresh({
        headers: {
          Cookie: `${oauthCookieTokens.refreshToken}=${refreshToken}`,
        },
        validateStatus(status) {
          return status > 200;
        },
      });

      expect(status).toEqual(500);
    });
  });
});

function expectNewCookies(oldCookie: string, newCookie: string) {
  const newCookies = newCookie
    .split(';')
    .map((cookie) => cookie.trim());

  oldCookie.split(';').map((cookie) => {
    expect(newCookies).not.toContain(cookie.trim());
  });
}
