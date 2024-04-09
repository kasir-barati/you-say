import FusionAuthClient, {
  GroupMember,
} from '@fusionauth/typescript-client';
import { Inject, Injectable } from '@nestjs/common';
import { generateRandomString } from '@shared';
import { createHash } from 'crypto';
import { Response } from 'express';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
} from '../auth.constants';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly fusionAuthConfigs: AuthModuleOptions,
    @Inject(AUTH_MODULE_FUSIONAUTH_CLIENT)
    private readonly fusionAuthClient: FusionAuthClient,
    private readonly fusionAuthErrorSerializer: FusionAuthErrorSerializer,
  ) {}

  async register({
    email,
    groups,
    lastName,
    firstName,
  }: {
    email: string;
    lastName?: string;
    firstName?: string;
    groups: FusionAuthUserGroup[];
  }): Promise<string> | never {
    const applicationId =
      this.fusionAuthConfigs.fusionAuthApplicationId;
    const memberships = this.getMemberships(groups);
    try {
      // Passing an empty string as userId signifies that FusionAuth should create it automatically.
      const { response } = await this.fusionAuthClient.register('', {
        sendSetPasswordEmail: true,
        registration: {
          applicationId,
        },
        user: {
          email,
          lastName,
          firstName,
          memberships,
          fullName: `${firstName} ${lastName}`,
          data: {
            // Here we can save meta data, or settings and other info
          },
        },
      });

      if (!response?.user || !response?.user?.id) {
        throw `[Unexpected-a3abc897fd] we do not have access to ${
          response.user ? 'user id' : 'user'
        }`;
      }
      await this.fusionAuthClient.refreshUserSearchIndex();

      return response.user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.fusionAuthErrorSerializer.duplicateEmail(error, email);
      this.fusionAuthErrorSerializer.fusionAuthError(error);
    }
  }

  /**
   * @description this method will modifies cookies attached to the response, add necessary search params for FusionAuth to be able to process a login request. [Their oauth login mechanism when is described here](https://fusionauth.io/articles/oauth/modern-guide-to-oauth).
   *
   * @returns login URL that user should use to be able to login
   */
  login(response: Response): string {
    const { oauthState, oauthNonce, oauthCodeVerifier } =
      this.configureOauth2LoginCookies(response);
    const loginRedirectUrl = this.constructOauth2LoginUrl({
      oauthState,
      oauthNonce,
      oauthCodeVerifier,
    });

    return loginRedirectUrl;
  }

  private constructOauth2LoginUrl({
    oauthNonce,
    oauthState,
    oauthCodeVerifier,
  }: {
    oauthState: string;
    oauthNonce: string;
    oauthCodeVerifier: string;
  }): string {
    /**
     * @description this should always be set to `'code'` for this grant. This tells the OAuth server you are using the Authorization Code grant.
     */
    const responseType = 'code';
    /**
     * @description this is an optional parameter, but because we have implemented PKCE, we must specify how PKCE `code_challenge` parameter was created. It can either be `'plain'` or `'S256'`. We never recommend using anything except `'S256'` which uses SHA-256 secure hashing for PKCE.
     */
    const codeChallengeMethod = 'S256';
    /**
     * @description FusionAuth verifies that the `code_challenge` matches the `oauthCodeVerifier` when issuing the access token. This ensures that the token request is coming from the same client that requested the authorization code.
     */
    const codeChallenge = createHash('sha256')
      .update(oauthCodeVerifier)
      .digest('base64url');
    /**
     * @description We are attaching to the login URL.
     */
    const state = oauthState;
    /**
     * @description Attaching the generated oath_nonce to the login URL.
     */
    const nonce = oauthNonce;
    const {
      appBaseUrl,
      fusionAuthHost,
      fusionAuthClientId,
      fusionAuthOauthScopes,
    } = this.fusionAuthConfigs;
    /**
     * @description An endpoint of Our backend that will be called right after when user enters their credentials in the login page of FusionAuth. Learn more by reading its doc.
     */
    const redirectUri = `${appBaseUrl}/auth/oauth-callback`;
    /**
     * @description To begin the Authorization Code Grant we need to redirect users to the Authorization endpoint from our application. Here we are passing the necessary infos such as: state, nonce, redirect_url, etc thorough query strings.
     */
    const loginRedirectUrl = new URL(
      `${fusionAuthHost}/oauth2/authorize`,
    );

    loginRedirectUrl.searchParams.append('state', state);
    loginRedirectUrl.searchParams.append('nonce', nonce);
    loginRedirectUrl.searchParams.append('redirect_uri', redirectUri);
    loginRedirectUrl.searchParams.append(
      'code_challenge_method',
      codeChallengeMethod,
    );
    loginRedirectUrl.searchParams.append(
      'code_challenge',
      codeChallenge,
    );
    loginRedirectUrl.searchParams.append(
      'scope',
      fusionAuthOauthScopes,
    );
    loginRedirectUrl.searchParams.append(
      'response_type',
      responseType,
    );
    loginRedirectUrl.searchParams.append(
      'client_id',
      fusionAuthClientId,
    );

    return loginRedirectUrl.toString();
  }

  // State is used to prevent CSRF, keep this for later.
  private configureOauth2LoginCookies(response: Response) {
    const { appBaseUrl } = this.fusionAuthConfigs;
    const secure = !appBaseUrl.includes('localhost');
    /**
     * @description oauthState is used to prevent `CSRF`, we'll keep this for later.
     */
    const oauthState = generateRandomString(86);
    /**
     * @description A nonce (number used once) is a random or pseudo-random value generated by backend (`client`) to prevent replay attacks. FusionAuth (authorization server) will reject any request with a nonce it has already seen, preventing attackers from replaying authorization requests to trick users into granting access.
     */
    const oauthNonce = generateRandomString(86);
    /**
     * @description The PKCE (Proof Key for Code Exchange) extension is designed to protect public clients (e.g. mobile, SPAs) from certain types of attacks when they use the authorization `'code'` grant type. Which is our case.
     * Client generates `oauth_code_verifier` which is a secret value and a derived value called the `code_challenge`. The `oauth_code_verifier` is sent with the authorization request, and the `code_challenge` is sent with the token request.
     *
     * That's also why we are returning `oauthCodeVerifier`. We are creating `code_challenge` in `constructOauth2LoginUrl`.
     */
    const oauthCodeVerifier = generateRandomString(86);

    response.cookie('oauth_state', oauthState, {
      httpOnly: true,
      secure,
    });
    response.cookie('oauth_code_verifier', oauthCodeVerifier, {
      httpOnly: true,
      secure,
    });
    response.cookie('oauth_nonce', oauthNonce, {
      httpOnly: true,
      secure,
    });

    return {
      oauthState,
      oauthNonce,
      oauthCodeVerifier,
    };
  }

  private getMemberships(
    groups: FusionAuthUserGroup[],
  ): GroupMember[] {
    const memberships: GroupMember[] = [];

    if (groups.includes(FusionAuthUserGroup.Admin)) {
      memberships.push({
        groupId: this.fusionAuthConfigs.fusionAuthAdminGroupId,
      });
    }

    return memberships;
  }
}
