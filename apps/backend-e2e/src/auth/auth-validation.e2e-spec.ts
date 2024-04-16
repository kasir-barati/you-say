import {
  OauthCallbackRequestQuery,
  generateRandomString,
} from '@shared';
import { AuthApi, RegisterDto } from '../api-client';

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

  describe('GET /auth/oauth-callback', () => {
    let cookie: string;

    beforeEach(() => {
      const state = generateRandomString();
      const nonce = generateRandomString();
      const codeVerifier = generateRandomString();

      cookie = `oauth_state=${state};oauth_nonce=${nonce};oauth_code_verifier=${codeVerifier};`;
    });

    it('should pass the validation layer', async () => {
      const code = generateRandomString();
      const state = generateRandomString();

      const { status } = await authApi.authControllerOauthCallback(
        { code, state },
        {
          headers: {
            Cookie: cookie,
          },
          validateStatus(statusCode) {
            return statusCode > 200;
          },
        },
      );

      expect(status).not.toEqual(400);
    });

    it.each<string>([
      '',
      'oauth_state=state;',
      'oauth_nonce=nonce;',
      'oauth_code_verifier=code',
      'oauth_state=state; oauth_nonce=nonce;',
      'oauth_state=state; oauth_code_verifier=code;',
      'oauth_nonce=nonce; oauth_code_verifier=code;',
      'oauth_state=; oauth_nonce=; oauth_code_verifier=;',
    ])(
      'should fail when it is missing one or more than one of the cookies',
      async (cookie) => {
        const { status } = await authApi.authControllerOauthCallback(
          { code: 'code', state: 'state' },
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
      { code: '', state: '' },
      { code: 'jp-code', state: '' },
      { code: '', state: 'f-state' },
    ])(
      'should fail when state/code is missing from the query parameters',
      async (queryParams) => {
        const { status } = await authApi.authControllerOauthCallback(
          queryParams,
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
  });
});
