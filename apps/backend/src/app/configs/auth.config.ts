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
      appBaseUrl: this.appConfigs.APP_BASE_URL,
      frontendUrl: this.appConfigs.FRONTEND_URL,
      fusionAuthHost: this.appConfigs.FUSIONAUTH_HOST,
      domainOfCookie: this.appConfigs.DOMAIN_OF_COOKIE,
      fusionAuthApiKey: this.appConfigs.FUSIONAUTH_API_KEY,
      fusionAuthIssuer: this.appConfigs.FUSIONAUTH_ISSUER,
      fusionAuthClientId: this.appConfigs.FUSIONAUTH_CLIENT_ID,
      fusionAuthTenantId: this.appConfigs.FUSIONAUTH_TENANT_ID,
      fusionAuthOauthScopes: this.appConfigs.FUSIONAUTH_OAUTH_SCOPES,
      fusionAuthOauthConfigurationClientSecret:
        this.appConfigs.OAUTH_CONFIGURATION_CLIENT_SECRET,
      fusionAuthAdminGroupId:
        this.appConfigs.FUSIONAUTH_ADMIN_GROUP_ID,
      fusionAuthApplicationId:
        this.appConfigs.FUSIONAUTH_APPLICATION_ID,
    };

    return options;
  }
}
