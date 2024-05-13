import { FusionAuthProviderConfig } from '@fusionauth/react-sdk';

export const fusionAuthProviderConfig: FusionAuthProviderConfig = {
  mePath: '/auth/me',
  loginPath: '/auth/login',
  logoutPath: '/auth/logout',
  registerPath: '/auth/register',
  tokenRefreshPath: '/auth/refresh',
  redirectUri: process.env.NEXT_PUBLIC_FRONTEND_URL,
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  scope: process.env.NEXT_PUBLIC_FUSIONAUTH_OAUTH_SCOPES,
  clientId: process.env.NEXT_PUBLIC_FUSIONAUTH_APPLICATION_ID,
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
  onRedirect(_state) {
    // TODO: Add notification
  },
};
