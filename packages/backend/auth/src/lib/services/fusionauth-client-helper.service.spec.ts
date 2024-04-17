import { LoggerService } from '@backend/logger';
import FusionAuthClient, { JWT } from '@fusionauth/typescript-client';
import { UnauthorizedException } from '@nestjs/common';
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
    it('should verify tokens', async () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthConfigs.fusionAuthClientId = 'client-uuid';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            aud: 'client-uuid',
            iss: 'https://you-say.com',
            nonce: 'some-random-string',
          } as JWT,
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      expect(result).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException if refresh token is missing', () => {
      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: '',
        accessToken: '',
        refreshToken: undefined,
        oauthNonce: 'some-random-string',
      });

      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if fusionAuthClient.validateJWT says access token is invalid', () => {
      fusionAuthClient.validateJWT.rejects();

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if issuer is invalid', async () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            iss: 'https://example.com',
          } as JWT,
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      await expect(result).rejects.toThrow(UnauthorizedException);
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith({
          message: 'We did not issue this JWT token!',
          jwtIssuer: 'https://example.com',
          fusionAuthIssuer: fusionAuthConfigs.fusionAuthIssuer,
        }),
      ).toBeTruthy();
    });

    it('should throw UnauthorizedException if issuer is not in JWT', async () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {},
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      await expect(result).rejects.toThrow(UnauthorizedException);
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith(
          'Issuer is missing in the received access token!',
        ),
      ).toBeTruthy();
    });

    it('should throw UnauthorizedException if audience is invalid', async () => {
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
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      await expect(result).rejects.toThrow(UnauthorizedException);
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith({
          message: 'We are not audience of this access token!',
          jwtAudience: 'client-uuid',
          fusionAuthClientId: fusionAuthConfigs.fusionAuthClientId,
        }),
      ).toBeTruthy();
    });

    it('should throw UnauthorizedException if audience is missing in jwt', async () => {
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
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      await expect(result).rejects.toThrow(UnauthorizedException);
      // Just to make sure that issuer was the cause for the error. We are throwing same error so that's the best we can do in order to put our mind at ease.
      expect(
        loggerService.error.calledWith(
          'Audience is missing in the received access token!',
        ),
      ).toBeTruthy();
    });

    it('should throw UnauthorizedException if fusionAuthClient.validateJWT says ID token is invalid', () => {
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
        oauthNonce: 'some-random-string',
      });

      expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the nonce in the validated jwt is not the same as the one passed to it as argument', async () => {
      fusionAuthConfigs.fusionAuthIssuer = 'https://you-say.com';
      fusionAuthConfigs.fusionAuthClientId = 'client-uuid';
      fusionAuthClient.validateJWT.resolves({
        response: {
          jwt: {
            aud: 'client-uuid',
            iss: 'https://you-say.com',
            nonce: 'some-nonce',
          } as JWT,
        },
      });

      const result = fusionAuthClientHelper.verifyExchangedTokens({
        idToken: '',
        accessToken: '',
        refreshToken: 'refresh token',
        oauthNonce: 'some-random-string',
      });

      await expect(result).rejects.toThrow(UnauthorizedException);
      expect(
        loggerService.error.calledWith({
          message:
            'The passed nonce is not equal to the one in the validated jwt!',
          jwtNonce: 'some-nonce',
          oauthNonce: 'some-random-string',
        }),
      ).toBeTruthy();
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
    it('should encode redirect url to state', async () => {
      const result = fusionAuthClientHelper.encodeRedirectUrlToState(
        'http://localhost:3000/',
        '/posts',
      );

      expect(result).toBe('aHR0cDovL2xvY2FsaG9zdDozMDAwLw==:/posts');
    });
  });
});
