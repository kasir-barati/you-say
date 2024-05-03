import { oauthCookieTokens } from '@shared';
import {
  FUSIONAUTH_APPLICATION_ID,
  FUSIONAUTH_HOST,
  OAUTH_CONFIGURATION_CLIENT_SECRET,
} from './env-variables.util';

interface Login {
  headers: { Cookie: string };
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<Login> {
  const authorizationCodeGrantUrl = new URL(
    'oauth2/token',
    FUSIONAUTH_HOST,
  ).toString();
  const response = await fetch(authorizationCodeGrantUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      username,
      password,
      grant_type: 'password',
      scope: 'openid offline_access',
      client_id: FUSIONAUTH_APPLICATION_ID,
      client_secret: OAUTH_CONFIGURATION_CLIENT_SECRET,
    }),
    keepalive: false,
  });
  const data = await response.json();
  const expiresInMs = data.expires_in * 1_000;
  const expiresIn = (Date.now() + expiresInMs) / 1000;

  return {
    headers: {
      Cookie: `${oauthCookieTokens.idToken}=${data.id_token}; ${oauthCookieTokens.accessToken}=${data.access_token}; ${oauthCookieTokens.refreshToken}=${data.refresh_token}; ${oauthCookieTokens.expiresIn}=${expiresIn}`,
    },
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn,
  };
}
