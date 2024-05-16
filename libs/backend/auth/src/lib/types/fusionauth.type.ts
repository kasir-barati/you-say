import { OAuthError } from '@fusionauth/typescript-client';

export interface FusionAuthOAuthError {
  statusCode: number;
  exception: OAuthError;
}
