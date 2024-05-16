import { LoggerService } from '@backend/logger';
import FusionAuthClient from '@fusionauth/typescript-client';
import { HttpException } from '@nestjs/common';
import { MockedEntityWithSinonStubs, SinonMock } from '@shared';
import { MobileLoginResponseDto } from '../dtos/mobile-login-response.dto';
import { MobileLoginDto } from '../dtos/mobile-login.dto';
import { MobileRegisterDto } from '../dtos/mobile-register.dto';
import { AuthModuleOptions } from '../types/auth.type';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';
import { MobileAuthService } from './mobile-auth.service';

describe('MobileAuthService', () => {
  let mobileAuthService: MobileAuthService;
  let fusionAuthConfigs: AuthModuleOptions;
  let loggerService: MockedEntityWithSinonStubs<LoggerService>;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;
  let fusionAuthClientHelper: MockedEntityWithSinonStubs<FusionAuthClientHelper>;
  let fusionAuthErrorSerializer: MockedEntityWithSinonStubs<FusionAuthErrorSerializer>;

  beforeEach(() => {
    loggerService = SinonMock.of(LoggerService);
    fusionAuthConfigs = {} as AuthModuleOptions;
    fusionAuthClient = SinonMock.of(FusionAuthClient);
    fusionAuthClientHelper = SinonMock.of(FusionAuthClientHelper);
    fusionAuthErrorSerializer = SinonMock.of(
      FusionAuthErrorSerializer,
    );
    mobileAuthService = new MobileAuthService(
      fusionAuthConfigs,
      fusionAuthClient,
      fusionAuthClientHelper,
      loggerService,
      fusionAuthErrorSerializer,
    );
  });

  it('should set context of logger service on module init', () => {
    mobileAuthService.onModuleInit();

    expect(loggerService.setContext.callCount).toEqual(1);
    expect(
      loggerService.setContext.calledWith(MobileAuthService.name),
    ).toBeTruthy();
  });

  describe('register', () => {
    it.each<MobileRegisterDto>([
      {
        email: 'email@example.com',
        firstName: 'Fist name',
        lastName: 'Family',
        password: 'some pass',
      },
      {
        email: 'ab@gmail.com',
        firstName: 'Honda',
        lastName: 'Kiyosaki',
        password: 'we!rd p@SS',
      },
    ])('should register a user with', async (mobileRegisterDto) => {
      fusionAuthConfigs.fusionAuthApplicationId = 'uuid';
      fusionAuthClientHelper.register
        .withArgs({
          groups: [],
          ...mobileRegisterDto,
          applicationId: 'uuid',
        })
        .resolves('user-uuid');

      const result = await mobileAuthService.register({
        groups: [],
        ...mobileRegisterDto,
      });

      expect(result).toBe('user-uuid');
    });

    it('should propagate errors which occurred in register', () => {
      fusionAuthClientHelper.register.rejects(new Error());

      const result = mobileAuthService.register({
        email: '',
        groups: [],
        password: '',
        lastName: '',
        firstName: '',
      });

      expect(result).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    it.each<MobileLoginDto>([
      { email: 'email@exam.com', password: 'pass1' },
      { email: 'some@email.jp', password: 'pass2' },
    ])(
      'should login user with the credentials',
      async (mobileLoginDto) => {
        fusionAuthConfigs.fusionAuthApplicationId = 'client-uuid';
        fusionAuthConfigs.fusionAuthOauthConfigurationClientSecret =
          'secret';
        fusionAuthClient.exchangeUserCredentialsForAccessToken
          .withArgs(
            mobileLoginDto.email,
            mobileLoginDto.password,
            'client-uuid',
            'secret',
            'openid offline_access',
            null,
          )
          .resolves({
            response: {
              id_token: 'id-token',
              access_token: 'access-token',
              refresh_token: 'refresh-token',
              expires_in: 1000,
              token_type: 'Bearer',
            },
          });

        const result = await mobileAuthService.login(mobileLoginDto);

        expect(result).toStrictEqual({
          accessToken: 'access-token',
          accessTokenExpiresIn: 1000,
          idToken: 'id-token',
          refreshToken: 'refresh-token',
          tokenType: 'Bearer',
        } as MobileLoginResponseDto);
      },
    );

    it('should throw error when exchangeUserCredentialsForAccessToken throws an error', () => {
      fusionAuthClient.exchangeUserCredentialsForAccessToken.rejects(
        new Error(),
      );

      const result = mobileAuthService.login({
        email: '',
        password: '',
      });

      expect(result).rejects.toThrow(Error);
    });

    it('should throw error when verifyExchangedTokens throws an error', () => {
      fusionAuthClient.exchangeUserCredentialsForAccessToken.resolves(
        {
          response: {
            id_token: 'id-token',
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            expires_in: 1000,
            token_type: 'Bearer',
          },
        },
      );
      fusionAuthClientHelper.verifyExchangedTokens.rejects(
        new HttpException(undefined, 503),
      );

      const result = mobileAuthService.login({
        email: '',
        password: '',
      });

      expect(result).rejects.toThrow(HttpException);
    });

    it('should throw error if response is undefined', () => {
      fusionAuthClient.exchangeUserCredentialsForAccessToken.resolves();

      const result = mobileAuthService.login({
        email: '',
        password: '',
      });

      expect(result).rejects.toThrow();
    });
  });
});
