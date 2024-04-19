import axios from 'axios';
import QueryString from 'qs';
import {
  FUSIONAUTH_CLIENT_ID,
  FUSIONAUTH_HOST,
  OAUTH_CONFIGURATION_CLIENT_SECRET,
} from './env-variables.util';

interface Login {
  headers: { Cookie: string };
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
  const { data } = await axios.post(
    authorizationCodeGrantUrl,
    QueryString.stringify({
      username,
      password,
      grant_type: 'password',
      scope: 'openid offline_access',
      client_id: FUSIONAUTH_CLIENT_ID,
      client_secret: OAUTH_CONFIGURATION_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    },
  );
  const expiresInMs = data.expires_in * 1_000;
  const expiresIn = (Date.now() + expiresInMs) / 1000;

  return {
    headers: {
      Cookie: `app.idt=${data.id_token}; app.at=${data.access_token}; rt=${data.refresh_token}; app.at_exp=${expiresIn}`,
    },
  };
}
