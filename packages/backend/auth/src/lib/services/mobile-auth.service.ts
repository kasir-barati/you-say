import { LoggerService } from '@backend/logger';
import FusionAuthClient from '@fusionauth/typescript-client';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
} from '../auth.constants';
import { MobileLoginResponseDto } from '../dtos/mobile-login-response.dto';
import { MobileLoginDto } from '../dtos/mobile-login.dto';
import { MobileRegisterDto } from '../dtos/mobile-register.dto';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthClientHelper } from './fusionauth-client-helper.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

@Injectable()
export class MobileAuthService implements OnModuleInit {
  private readonly scope = 'openid offline_access';
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly fusionAuthConfigs: AuthModuleOptions,
    @Inject(AUTH_MODULE_FUSIONAUTH_CLIENT)
    private readonly fusionAuthClient: FusionAuthClient,
    private readonly fusionAuthClientHelper: FusionAuthClientHelper,
    private readonly loggerService: LoggerService,
    private readonly fusionAuthErrorSerializer: FusionAuthErrorSerializer,
  ) {}

  onModuleInit() {
    this.loggerService.setContext(MobileAuthService.name);
  }

  async register({
    email,
    groups,
    lastName,
    firstName,
    password,
  }: {
    groups: FusionAuthUserGroup[];
  } & MobileRegisterDto): Promise<string> | never {
    const applicationId =
      this.fusionAuthConfigs.fusionAuthApplicationId;
    const userId = this.fusionAuthClientHelper.register({
      email,
      groups,
      lastName,
      password,
      firstName,
      applicationId,
    });

    return userId;
  }

  async login(
    mobileLoginDto: MobileLoginDto,
  ): Promise<MobileLoginResponseDto> {
    const clientId = this.fusionAuthConfigs.fusionAuthApplicationId;
    const {
      response: {
        id_token: idToken,
        token_type: tokenType,
        expires_in: accessTokenExpiresIn,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    } = await this.fusionAuthClient
      .exchangeUserCredentialsForAccessToken(
        mobileLoginDto.email,
        mobileLoginDto.password,
        clientId,
        this.fusionAuthConfigs
          .fusionAuthOauthConfigurationClientSecret,
        this.scope,
        null,
      )
      .catch((error) => {
        this.loggerService.error({
          message: 'Could not exchange credentials for tokens!',
          error,
        });
        this.fusionAuthErrorSerializer.oauthError(error);
        this.fusionAuthErrorSerializer.unknownError(error);
      });

    await this.fusionAuthClientHelper.verifyExchangedTokens({
      idToken,
      accessToken,
      refreshToken,
    });

    return {
      idToken,
      tokenType,
      accessTokenExpiresIn,
      accessToken,
      refreshToken,
    };
  }
}
