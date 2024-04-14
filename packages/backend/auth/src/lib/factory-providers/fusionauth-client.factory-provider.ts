import { FusionAuthClient } from '@fusionauth/typescript-client';
import { FactoryProvider } from '@nestjs/common';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
} from '../auth.constants';
import { AuthModuleOptions } from '../types/auth.type';

export const fusionAuthClientFactory: FactoryProvider<FusionAuthClient> =
  {
    provide: AUTH_MODULE_FUSIONAUTH_CLIENT,
    useFactory: (authModuleOptions: AuthModuleOptions) => {
      const { fusionAuthApiKey, fusionAuthTenantId, fusionAuthHost } =
        authModuleOptions;

      return new FusionAuthClient(
        fusionAuthApiKey,
        fusionAuthHost,
        fusionAuthTenantId,
      );
    },
    inject: [{ token: AUTH_MODULE_OPTIONS, optional: false }],
  };
