import { FusionAuthConfig } from '@fusionauth/react-sdk';

export const fusionAuthConfig: FusionAuthConfig = {
  mePath: '/auth/me',
  loginPath: '/auth/login',
  logoutPath: '/auth/logout',
  registerPath: '/auth/register',
  tokenRefreshPath: '/auth/refresh',
  redirectUri: process.env.NEXT_PUBLIC_FRONTEND_URL,
  scope: process.env.NEXT_PUBLIC_FUSIONAUTH_OAUTH_SCOPES,
  clientID: process.env.NEXT_PUBLIC_FUSIONAUTH_APPLICATION_ID,
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  onRedirectSuccess(_state) {
    // TODO: Add notification
  },
  onRedirectFail(_error) {
    // TODO: Add notification
  },
};
