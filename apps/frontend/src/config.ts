import { FusionAuthConfig as FusionAuthProviderConfig } from '@fusionauth/react-sdk';

export const fusionAuthProviderConfig: FusionAuthProviderConfig = {
  mePath: '/auth/me',
  loginPath: '/auth/login',
  logoutPath: '/auth/logout',
  registerPath: '/auth/register',
  tokenRefreshPath: '/auth/refresh',
  redirectUri: process.env.NEXT_PUBLIC_FRONTEND_URL,
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  scope: process.env.NEXT_PUBLIC_FUSIONAUTH_OAUTH_SCOPES,
  clientID: process.env.NEXT_PUBLIC_FUSIONAUTH_APPLICATION_ID,
  // TODO: https://github.com/FusionAuth/fusionauth-javascript-sdk/issues/99
  // shouldAutoFetchUserInfo: true,
  // shouldAutoRefresh: true,
  // onRedirect(_state) {},
};
