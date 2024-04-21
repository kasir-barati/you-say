import {
  LoginRequestQuery,
  OauthCallbackRequestQuery,
  generateRandomString,
  getTempUser,
  oauthCookieTokens,
} from '@shared';
import {
  AuthApi,
  AuthApiAuthControllerLogoutRequest,
  RegisterDto,
} from '../api-client';
import { login } from '../utils/login.util';

describe('Auth -- validation', () => {
  const authApi: AuthApi = new AuthApi();

  describe('POST /auth/register', () => {
    it.each<RegisterDto>([
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

    it.each<RegisterDto>([
      { email: 'invalid', firstName: 'Mohammad', lastName: 'valid' },
      { email: 'valid@mail.com', firstName: '', lastName: 'valid' },
      { email: 'test@valid.jp', firstName: 'Kasir', lastName: '' },
      {
        email: 'test@valid.jp',
        firstName: null,
        lastName: undefined,
      },
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

  describe('GET /auth/login', () => {
    it.each<LoginRequestQuery>([
      {
        state: '/posts',
        redirectUrl: 'http://localhost:3000/',
        clientId: '21215650-c4c8-44fe-b069-7b6484e1c6a4',
      },
      {
        state: '/contact-us',
        redirectUrl: 'https://you-say.com',
        clientId: 'd070911e-bc8c-472f-a5d3-e83a584e0073',
      },
      {
        state: '/contact-us',
        redirectUrl: 'http://localhost',
        clientId: 'd070911e-bc8c-472f-a5d3-e83a584e0073',
      },
    ])('should pass the validation layer', async () => {
      const { status } = await authApi.authControllerLogin(
        {
          state: '/posts',
          redirectUri: 'http://localhost:3000/',
          clientId: '21215650-c4c8-44fe-b069-7b6484e1c6a4',
        },
        {
          validateStatus(statusCode) {
            return statusCode > 200;
          },
          // To prevent this e2e test from getting redirected to OAuth server
          maxRedirects: 0,
        },
      );

      expect(status).not.toEqual(400);
    });

    it.each<LoginRequestQuery>([
      {
        clientId: '',
        redirectUrl: 'http://localhost:3000',
        state: '/posts',
      },
      {
        clientId: generateRandomString(),
        redirectUrl: 'http://localhost:3000',
        state: '/posts',
      },
      {
        clientId: '5bc550db-47b5-4058-8f39-ecd860352954',
        redirectUrl: generateRandomString(),
        state: '/posts',
      },
      {
        clientId: '88612369-6cef-4c35-8302-cfeac55abd1e',
        redirectUrl: '',
        state: '/posts',
      },
      {
        clientId: '88612369-6cef-4c35-8302-cfeac55abd1e',
        redirectUrl: 'https://you-say.com',
        state: '',
      },
    ])(
      'should throw 400 error when query param is %o',
      async (loginQuery) => {
        const { status } = await authApi.authControllerLogin(
          {
            state: loginQuery.state,
            clientId: loginQuery.clientId,
            redirectUri: loginQuery.redirectUrl,
          },
          {
            validateStatus(statusCode) {
              return statusCode > 200;
            },
            maxRedirects: 0,
          },
        );

        expect(status).toEqual(400);
      },
    );
  });

  describe('GET /auth/oauth-callback', () => {
    it('should pass the validation layer', async () => {
      const code = generateRandomString();
      const state = generateRandomString();

      const { status } = await authApi.authControllerOauthCallback(
        {
          code,
          state,
          locale: 'en',
          userState: 'Authenticated',
        },
        {
          headers: {
            Cookie: 'codeVerifier=wuruazmrvvteawaflktmzxyw_gwmt-yz',
          },
          validateStatus(statusCode) {
            return statusCode > 200;
          },
        },
      );

      expect(status).not.toEqual(400);
    });

    it.each<string>(['', 'codeVerifier='])(
      'should fail when request is missing codeVerifier cookies',
      async (cookie) => {
        const { status } = await authApi.authControllerOauthCallback(
          {
            code: 'md2lLzEDsv2bPePUOlV0mudVhHmRCGInM67At9wB3Ew',
            state:
              'aHR0cDovL2xvY2FsaG9zdDozMDAw%3Aa3589a11ef6a19f9c77b78456604a4ed0c372a379a17007bc2471136%3A',
            locale: 'en',
            userState: 'Authenticated',
          },
          {
            headers: {
              Cookie: cookie,
            },
            validateStatus(statusCode) {
              return statusCode > 200;
            },
          },
        );

        expect(status).toEqual(400);
      },
    );

    it.each<OauthCallbackRequestQuery>([
      {
        code: '',
        state: '',
        locale: 'en',
        userState: 'Authenticated',
      },
      {
        code: generateRandomString(),
        state: 'some encoded random string',
        locale: '',
        userState: 'Authenticated',
      },
      {
        code: '',
        locale: 'en',
        state: 'a long string which is encoded',
        userState: 'Authenticated',
      },
    ])(
      'should fail when something in query param is invalid',
      async (queryParams) => {
        const { status } = await authApi.authControllerOauthCallback(
          queryParams,
          {
            headers: {
              Cookie: 'codeVerifier=wuruazmrvvteawaflktmzxyw_gwmt-yz',
            },
            validateStatus(statusCode) {
              return statusCode > 200;
            },
          },
        );

        expect(status).toEqual(400);
      },
    );
  });

  describe('GET /auth/me', () => {
    it.each<string>([
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      'invalid token',
    ])(
      'should fail when access token is either expired, invalid.',
      async (accessToken) => {
        const { status } = await authApi.authControllerMe({
          headers: {
            Cookie: `app.at=${accessToken}`,
          },
          validateStatus(statusCode) {
            return statusCode > 200;
          },
        });

        expect(status).toEqual(401);
      },
    );
  });

  describe('GET /auth/logout', () => {
    it.each<AuthApiAuthControllerLogoutRequest>([
      {
        postLogoutRedirectUri: 'https://you-say.com',
      },
      {
        postLogoutRedirectUri: 'http://localhost:3000',
        clientId: 'dbaa2003-a000-4d69-a59d-3f1a227a2e86',
      },
    ])(
      'should pass the validation layer when queries are: %o',
      async (queries) => {
        const tempUser = getTempUser();
        const authenticationResult = await login({
          username: tempUser.email,
          password: tempUser.password,
        });

        const { status } = await authApi.authControllerLogout(
          queries,
          {
            validateStatus(status) {
              return status >= 200;
            },
            headers: authenticationResult.headers,
            maxRedirects: 0,
          },
        );

        expect(status).not.toEqual(400);
      },
    );

    it.each<AuthApiAuthControllerLogoutRequest>([
      {
        postLogoutRedirectUri: generateRandomString(),
        clientId: generateRandomString(),
      },
      {
        postLogoutRedirectUri: 'www.you-say.com',
      },
    ])(
      'should not pass the validation layer when queries are: %o',
      async (queries) => {
        const tempUser = getTempUser();
        const authenticationResult = await login({
          username: tempUser.email,
          password: tempUser.password,
        });

        const { status } = await authApi.authControllerLogout(
          queries,
          {
            validateStatus(status) {
              return status > 200;
            },
            headers: authenticationResult.headers,
            maxRedirects: 0,
          },
        );

        expect(status).toEqual(400);
      },
    );
  });

  describe('POST /auth/refresh', () => {
    it('should pass the validation layer', async () => {
      const { status } = await authApi.authControllerRefresh({
        headers: {
          Cookie: `${oauthCookieTokens.refreshToken}=${generateRandomString()}`,
        },
        validateStatus(status) {
          return status > 200;
        },
      });

      expect(status).not.toEqual(400);
    });

    it('should not pass validation layer', async () => {
      const { status } = await authApi.authControllerRefresh({
        headers: {
          Cookie: `${oauthCookieTokens.refreshToken}=`,
        },
        validateStatus(status) {
          return status > 200;
        },
      });

      expect(status).toEqual(400);
    });
  });
});
