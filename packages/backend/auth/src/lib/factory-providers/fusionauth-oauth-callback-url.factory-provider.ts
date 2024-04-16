import { FactoryProvider } from '@nestjs/common';
import {
  AUTH_MODULE_OPTIONS,
  FUSIONAUTH_OAUTH_CALLBACK_URL,
} from '../auth.constants';
import { AuthModuleOptions } from '../types/auth.type';

export const fusionAuthOauthCallbackUrlFactory: FactoryProvider<string> =
  {
    provide: FUSIONAUTH_OAUTH_CALLBACK_URL,
    useFactory: (authModuleOptions: AuthModuleOptions) => {
      return `${authModuleOptions.appBaseUrl}/auth/oauth-callback`;
    },
    inject: [{ token: AUTH_MODULE_OPTIONS, optional: false }],
  };
