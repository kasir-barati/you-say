import { AuthModuleOptions, AuthOptionsFactory } from '@backend/auth';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';

export class AuthModuleConfig implements AuthOptionsFactory {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}

  createAuthOptions():
    | AuthModuleOptions
    | Promise<AuthModuleOptions> {
    const options: AuthModuleOptions = {
      fusionAuthHost: this.appConfigs.FUSIONAUTH_HOST,
      fusionAuthApiKey: this.appConfigs.FUSIONAUTH_API_KEY,
      fusionAuthIssuer: this.appConfigs.FUSIONAUTH_ISSUER,
      fusionAuthClientId: this.appConfigs.FUSIONAUTH_CLIENT_ID,
      fusionAuthTenantId: this.appConfigs.FUSIONAUTH_TENANT_ID,
      fusionAuthAdminGroupId:
        this.appConfigs.FUSIONAUTH_ADMIN_GROUP_ID,
      fusionAuthApplicationId:
        this.appConfigs.FUSIONAUTH_APPLICATION_ID,
    };

    return options;
  }
}