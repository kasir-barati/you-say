import { LoggerService } from '@backend/logger';
import FusionAuthClient, { JWT } from '@fusionauth/typescript-client';
import { HttpException } from '@nestjs/common';
import { MockedEntityWithSinonStubs, SinonMock } from '@shared';
import { AuthModuleOptions } from '../types/auth.type';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';

describe('FusionAuthClientHelper', () => {
  let fusionAuthClientHelper: FusionAuthClientHelper;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;
  let fusionAuthConfigs: AuthModuleOptions;
  let loggerService: MockedEntityWithSinonStubs<LoggerService>;

  beforeEach(() => {
    fusionAuthConfigs = {} as AuthModuleOptions;
    loggerService = SinonMock.of(LoggerService);
    fusionAuthClient = SinonMock.of(FusionAuthClient);
    fusionAuthClientHelper = new FusionAuthClientHelper(
      fusionAuthConfigs,
      fusionAuthClient,
      loggerService,
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
      fusionAuthConfigs.fusionAuthClientId = 'client-uuid';
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
      fusionAuthConfigs.fusionAuthClientId = 'some-uuid';
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
          fusionAuthClientId: fusionAuthConfigs.fusionAuthClientId,
        }),
      ).toBeTruthy();
    });

    it('should throw HttpException if audience is missing in jwt', async () => {
      fusionAuthConfigs.fusionAuthClientId = 'some-uuid';
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
      fusionAuthConfigs.fusionAuthClientId = 'client-uuid';
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
});
