import { LoggerService } from '@backend/logger';
import FusionAuthClient, { JWT } from '@fusionauth/typescript-client';
import { HttpException } from '@nestjs/common';
import {
  MockedEntityWithSinonStubs,
  SinonMock,
  oauthCookieTokens,
} from '@shared';
import { Response } from 'express';
import * as Sinon from 'sinon';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

describe('FusionAuthClientHelper', () => {
  let fusionAuthClientHelper: FusionAuthClientHelper;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;
  let fusionAuthConfigs: AuthModuleOptions;
  let loggerService: MockedEntityWithSinonStubs<LoggerService>;
  const fusionAuthErrorSerializer = new FusionAuthErrorSerializer();

  beforeEach(() => {
    fusionAuthConfigs = {} as AuthModuleOptions;
    loggerService = SinonMock.of(LoggerService);
    fusionAuthClient = SinonMock.of(FusionAuthClient);
    fusionAuthClientHelper = new FusionAuthClientHelper(
      fusionAuthConfigs,
      fusionAuthClient,
      loggerService,
      fusionAuthErrorSerializer,
    );
  });

  it('should set context of logger service on module init', () => {
    fusionAuthClientHelper.onModuleInit();

    expect(loggerService.setContext.callCount).toEqual(1);
    expect(
      loggerService.setContext.calledWith(
        FusionAuthClientHelper.name,
      ),
    ).toBeTruthy();
  });

  describe('verifyExchangedTokens', () => {
    it.each<{
      idToken: string;
      accessToken: string;
      refreshToken: string;
    }>([
      {
        idToken: 'jwt',
        accessToken: 'jwt at',
        refreshToken: 'rf',
      },
      {
        idToken: 'some-jwt',
        accessToken: 'jwt access token',
        refreshToken: 'someRandomString',
      },
    ])('should pass when tokens are: %o', async (tokens) => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthConfigs.fusionAuthApplicationId = 'client-uuid';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            aud: 'client-uuid',
            iss: 'https://you-say.com',
          } as JWT,
        },
      });

      const result =
        fusionAuthClientHelper.verifyExchangedTokens(tokens);

      expect(result).resolves.not.toThrow();
    });

    it('should throw HttpException if refresh token is missing', () => {
      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'jwt',
        accessToken: 'jwt at',
        refreshToken: undefined,
      });

      expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
    });

    it('should throw HttpException if fusionAuthClient.validateJWT says access token is invalid', () => {
      fusionAuthClient.validateJWT.rejects();

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'jwt1',
        accessToken: 'jwt ac token',
        refreshToken: 'refresh token',
      });

      expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
    });

    it('should throw HttpException if issuer is invalid', async () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            iss: 'https://example.com',
          } as JWT,
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'jwt4',
        accessToken: 'jwt2',
        refreshToken: 'refresh token',
      });

      await expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith({
          message: 'We did not issue this JWT token!',
          jwtIssuer: 'https://example.com',
          fusionAuthIssuer: fusionAuthConfigs.fusionAuthIssuer,
        }),
      ).toBeTruthy();
    });

    it('should throw HttpException if issuer is not in JWT', async () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {},
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'jwt5',
        accessToken: 'jwt9',
        refreshToken: 'refresh token',
      });

      await expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith(
          'Issuer is missing in the received access token!',
        ),
      ).toBeTruthy();
    });

    it('should throw HttpException if audience is invalid', async () => {
      fusionAuthConfigs.fusionAuthApplicationId = 'some-uuid';
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            aud: 'client-uuid',
            iss: 'https://you-say.com',
          } as JWT,
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'jwt-token',
        accessToken: 'funny-jwt-token',
        refreshToken: 'refresh token',
      });

      await expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith({
          message: 'We are not audience of this access token!',
          jwtAudience: 'client-uuid',
          fusionAuthApplicationId:
            fusionAuthConfigs.fusionAuthApplicationId,
        }),
      ).toBeTruthy();
    });

    it('should throw HttpException if audience is missing in jwt', async () => {
      fusionAuthConfigs.fusionAuthApplicationId = 'some-uuid';
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            iss: 'https://you-say.com',
          } as JWT,
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'hi-jwt',
        accessToken: 'by-jwt',
        refreshToken: 'refresh token',
      });

      await expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith(
          'Audience is missing in the received access token!',
        ),
      ).toBeTruthy();
    });

    it('should throw HttpException if fusionAuthClient.validateJWT says ID token is invalid', () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthConfigs.fusionAuthApplicationId = 'client-uuid';
      fusionAuthClient.validateJWT.withArgs('accessToken').resolves({
        response: {
          jwt: {
            aud: 'client-uuid',
            iss: 'https://you-say.com',
          } as JWT,
        },
      });
      fusionAuthClient.validateJWT.withArgs('idToken').rejects();

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: 'idToken',
        accessToken: 'accessToken',
        refreshToken: 'refresh token',
      });

      expect(result).rejects.toThrow(
        new HttpException(undefined, 503),
      );
    });
  });

  describe('generatePkce', () => {
    it('should generate pkce', async () => {
      const result = await fusionAuthClientHelper.generatePkce();

      expect(result).toStrictEqual({
        codeChallenge: expect.any(String),
        codeVerifier: expect.any(String),
      });
    });
  });

  describe('encodeRedirectUrlToState', () => {
    it.each<{ redirectUrl: string; encodedUrl: string }>([
      {
        redirectUrl: 'http://localhost:3000/',
        encodedUrl: 'aHR0cDovL2xvY2FsaG9zdDozMDAwLw==:/posts',
      },
      {
        redirectUrl: 'https://you-say.com/',
        encodedUrl: 'aHR0cHM6Ly95b3Utc2F5LmNvbS8=:/posts',
      },
    ])(
      'should encode $redirectUrl to state',
      async ({ redirectUrl, encodedUrl }) => {
        const result =
          fusionAuthClientHelper.encodeRedirectUrlToState(
            redirectUrl,
            '/posts',
          );

        expect(result).toBe(encodedUrl);
      },
    );

    it.each<unknown>([123, true, { some: 1 }])(
      'should fail when invalid data type (%o) have been passed as URL',
      (url) => {
        expect(() =>
          fusionAuthClientHelper.encodeRedirectUrlToState(
            url as string,
            '/posts',
          ),
        ).toThrow();
      },
    );
  });

  describe('decodeRedirectUrlFromState', () => {
    it.each<{ redirectUrl: string; encodedUrl: string }>([
      {
        redirectUrl: 'http://localhost:3000/',
        encodedUrl: 'aHR0cDovL2xvY2FsaG9zdDozMDAwLw==:/posts',
      },
      {
        redirectUrl: 'https://you-say.com/',
        encodedUrl: 'aHR0cHM6Ly95b3Utc2F5LmNvbS8=:/posts',
      },
    ])(
      'should decode redirect url ($redirectUrl) from state',
      ({ redirectUrl, encodedUrl }) => {
        const result =
          fusionAuthClientHelper.decodeRedirectUrlFromState({
            state: encodedUrl,
            locale: 'en',
            userState: 'Authenticated',
          });

        expect(result).toBe(
          `${redirectUrl}?state=%2Fposts&locale=en&userState=Authenticated`,
        );
      },
    );
  });

  describe('register', () => {
    it.each<Parameters<typeof fusionAuthClientHelper.register>[0]>([
      {
        groups: [],
        firstName: 'test',
        lastName: 'testi',
        email: 'test@te.js',
        password: 'password',
        applicationId: 'app-uuid1',
      },
      {
        groups: [FusionAuthUserGroup.Admin],
        firstName: 'Lou',
        lastName: 'Chen',
        password: 'complex',
        email: 'some@thing.jp',
        applicationId: 'app-uuid2',
      },
    ])(
      'should register user with the passed args (%o) and return user id',
      async (registerArgs) => {
        fusionAuthConfigs.fusionAuthAdminGroupId = 'admin-group-id';
        fusionAuthClient.register.resolves({
          response: { user: { id: 'user-uuid' } },
        });

        const result = await fusionAuthClientHelper.register({
          email: registerArgs.email,
          groups: registerArgs.groups,
          lastName: registerArgs.lastName,
          password: registerArgs.password,
          firstName: registerArgs.firstName,
          applicationId: registerArgs.applicationId,
        });

        expect(result).toBe('user-uuid');
        expect(
          fusionAuthClient.register.calledWithMatch('', {
            sendSetPasswordEmail: false,
            skipVerification: false,
            registration: {
              applicationId: registerArgs.applicationId,
            },
            user: {
              email: registerArgs.email,
              lastName: registerArgs.lastName,
              firstName: registerArgs.firstName,
              password: registerArgs.password,
              fullName: `${registerArgs.firstName} ${registerArgs.lastName}`,
              data: {},
            },
          }),
        ).toBeTruthy();
      },
    );

    it('should register user with the specified group', async () => {
      fusionAuthConfigs.fusionAuthAdminGroupId = 'admin-group-id';
      fusionAuthClient.register.resolves({
        response: { user: { id: 'user-uuid' } },
      });

      const result = await fusionAuthClientHelper.register({
        firstName: 'Lou',
        lastName: 'Chen',
        password: 'complex',
        email: 'some@thing.jp',
        applicationId: 'app-uuid2',
        groups: [FusionAuthUserGroup.Admin],
      });

      expect(result).toBe('user-uuid');
      expect(
        fusionAuthClient.register.calledWithMatch('', {
          user: {
            memberships: [{ groupId: 'admin-group-id' }],
          },
        }),
      ).toBeTruthy();
    });

    it('should register user without password', async () => {
      fusionAuthClient.register.resolves({
        response: { user: { id: 'userId' } },
      });

      const result = await fusionAuthClientHelper.register({
        groups: [],
        firstName: 'Yu',
        lastName: 'Zhang',
        email: 'yu.zhang@yahoo.com',
        applicationId: 'app-uuid3',
      });

      expect(result).toBe('userId');
      expect(
        fusionAuthClient.register.calledWithMatch('', {
          sendSetPasswordEmail: true,
          skipVerification: true,
        }),
      );
    });

    it('should throw an error when user.id does not exist in the response', async () => {
      fusionAuthClient.register.resolves({ response: { user: {} } });

      const result = fusionAuthClientHelper.register({
        email: '',
        groups: [],
        lastName: '',
        firstName: '',
        applicationId: '',
      });

      await expect(result).rejects.toThrow();
      expect(
        loggerService.error.calledWith(
          '[Unexpected-a3abc897fd] we do not have access to user id!',
        ),
      ).toBeTruthy();
    });

    it('should throw an error when user does not exist in the response', async () => {
      fusionAuthClient.register.resolves({ response: {} });

      const result = fusionAuthClientHelper.register({
        email: '',
        groups: [],
        lastName: '',
        firstName: '',
        applicationId: '',
      });

      await expect(result).rejects.toThrow();
      expect(
        loggerService.error.calledWith(
          '[Unexpected-a3abc897fd] we do not have access to user!',
        ),
      ).toBeTruthy();
    });

    it('should throw an error when fusionAuthClient.register throws an error', async () => {
      fusionAuthClient.register.rejects(new Error());

      const result = fusionAuthClientHelper.register({
        email: '',
        groups: [],
        lastName: '',
        firstName: '',
        applicationId: '',
      });

      await expect(result).rejects.toThrow();
    });

    it('should throw an error when fusionAuthClient.refreshUserSearchIndex throws an error', async () => {
      const error = new Error('refreshUserSearchIndex exploded');
      fusionAuthClient.register.resolves({
        response: { user: { id: 'some-user-uuid' } },
      });
      fusionAuthClient.refreshUserSearchIndex.rejects(error);

      const result = fusionAuthClientHelper.register({
        email: '',
        groups: [],
        lastName: '',
        firstName: '',
        applicationId: '',
      });

      await expect(result).rejects.toThrow();
      expect(loggerService.error.calledWith(error)).toBeTruthy();
    });
  });

  describe('attachExchangedTokensToResponse', () => {
    it.each([
      {
        accessTokenExpiresIn: 100,
        idToken: 'jwt-id-token1',
        accessToken: 'jwt-at-1',
        refreshToken: 'random-string-1',
        response: SinonMock.with<Response>({}),
      },
      {
        accessTokenExpiresIn: 700,
        accessToken: 'some-jwt-at-1',
        idToken: 'another-jwt-id-token',
        refreshToken: 'refresh-token',
        response: SinonMock.with<Response>({}),
      },
    ])(
      'should attach exchanged tokens to the response: %o',
      (args) => {
        fusionAuthClientHelper.attachExchangedTokensToResponse(args);

        expect(args.response.cookie.callCount).toBe(4);
        expect(
          args.response.cookie.calledWithExactly(
            oauthCookieTokens.accessToken,
            args.accessToken,
            {
              secure: true,
              httpOnly: true,
              sameSite: 'lax',
            },
          ),
        ).toBeTruthy();
        expect(
          args.response.cookie.calledWithExactly(
            oauthCookieTokens.refreshToken,
            args.refreshToken,
            {
              secure: true,
              httpOnly: true,
              sameSite: 'lax',
            },
          ),
        ).toBeTruthy();
        expect(
          args.response.cookie.calledWithExactly(
            oauthCookieTokens.idToken,
            args.idToken,
            {
              secure: true,
              sameSite: 'lax',
              httpOnly: false,
            },
          ),
        ).toBeTruthy();
        expect(
          args.response.cookie.calledWithExactly(
            oauthCookieTokens.expiresIn,
            Sinon.match.number,
            {
              secure: true,
              sameSite: 'lax',
              httpOnly: false,
            },
          ),
        ).toBeTruthy();
      },
    );
  });
});
