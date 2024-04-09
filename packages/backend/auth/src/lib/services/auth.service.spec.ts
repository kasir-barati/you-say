import FusionAuthClient from '@fusionauth/typescript-client';
import { MockedEntityWithSinonStubs, SinonMock } from '@shared';
import { Response } from 'express';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { AuthService } from './auth.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';
import Sinon = require('sinon');

describe('AuthService', () => {
  let authService: AuthService;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;
  let fusionAuthConfigs: AuthModuleOptions;

  beforeEach(() => {
    const fusionAuthErrorSerializer = new FusionAuthErrorSerializer();
    fusionAuthConfigs = {
      appBaseUrl: 'http:localhost:3001',
      fusionAuthHost: 'http://fusionauth:9011',
      fusionAuthApplicationId: 'uuid',
      fusionAuthAdminGroupId: 'uuid',
    } as AuthModuleOptions;
    fusionAuthClient =
      SinonMock.of<FusionAuthClient>(FusionAuthClient);
    authService = new AuthService(
      fusionAuthConfigs,
      fusionAuthClient,
      fusionAuthErrorSerializer,
    );
  });

  it.each<
    { userId: string } & Parameters<typeof authService.register>[0]
  >([
    {
      groups: [],
      userId: 'uuid1',
      email: 'test@te.js',
    },
    {
      groups: [],
      userId: 'uuid1',
      email: 'test@te.js',
      firstName: 'test',
      lastName: 'test',
    },
    {
      userId: 'uuid2',
      email: 'temp@te.com',
      groups: [FusionAuthUserGroup.Admin],
    },
  ])(
    'should return $userId this.fusionAuthClient.register when I call register',
    async ({ email, groups, userId, firstName, lastName }) => {
      fusionAuthClient.register.resolves({
        response: { user: { id: userId } },
      });

      const result = await authService.register({
        email,
        firstName,
        lastName,
        groups,
      });

      expect(result).toBe(userId);
    },
  );

  it.each<{ response: { user?: { id?: string } } }>([
    { response: {} },
    { response: { user: {} } },
  ])(
    'should throw an error when user or user.id does not exist in the response',
    async (mockedResponse) => {
      fusionAuthClient.register.resolves(mockedResponse);

      const result = authService.register({
        email: 't@t.com',
        groups: [],
      });

      await expect(result).rejects.toThrow();
    },
  );

  it('should throw an error when fusionAuthClient.register throws an error', async () => {
    fusionAuthClient.register.rejects();

    const result = authService.register({
      email: 't@t.com',
      groups: [],
    });

    await expect(result).rejects.toThrow();
  });

  it('should generate a login URL', () => {
    const response = SinonMock.with<Response>({
      cookie: jest.fn(),
    });
    fusionAuthConfigs.fusionAuthClientId = 'uuid';
    fusionAuthConfigs.fusionAuthOauthScopes =
      'profile offline_access openid';

    const loginRedirectUrl = new URL(authService.login(response));

    expect(loginRedirectUrl.protocol).toBe('http:');
    expect(loginRedirectUrl.host).toBe('fusionauth:9011');
    expect(loginRedirectUrl.pathname).toBe('/oauth2/authorize');
    expect(
      loginRedirectUrl.searchParams.get('code_challenge_method'),
    ).toBe('S256');
    expect(loginRedirectUrl.searchParams.get('scope')).toBe(
      'profile offline_access openid',
    );
    expect(loginRedirectUrl.searchParams.get('response_type')).toBe(
      'code',
    );
    expect(loginRedirectUrl.searchParams.get('client_id')).toBe(
      'uuid',
    );
    expect(loginRedirectUrl.searchParams.get('state')).toEqual(
      expect.any(String),
    );
    expect(loginRedirectUrl.searchParams.get('nonce')).toEqual(
      expect.any(String),
    );
    expect(loginRedirectUrl.searchParams.get('redirect_uri')).toEqual(
      expect.any(String),
    );
    expect(
      loginRedirectUrl.searchParams.get('code_challenge'),
    ).toEqual(expect.any(String));
  });

  it('should generate a login URL with cookies who are secure', () => {
    const response = SinonMock.with<Response>({});
    fusionAuthConfigs.appBaseUrl = 'https://fusionauth.you-say.com';
    fusionAuthConfigs.fusionAuthClientId = 'uuid';
    fusionAuthConfigs.fusionAuthOauthScopes =
      'profile offline_access openid';

    authService.login(response);

    expect(response.cookie.callCount).toBe(3);
    for (const cookie of [
      'oauth_state',
      'oauth_code_verifier',
      'oauth_nonce',
    ]) {
      expect(
        response.cookie.calledWithExactly(
          cookie,
          Sinon.match.string,
          {
            httpOnly: true,
            secure: true,
          },
        ),
      ).toBeTruthy();
    }
  });
});
