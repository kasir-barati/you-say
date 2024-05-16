import { TokenType } from '@fusionauth/typescript-client';

export interface MobileLoginResponse {
  idToken: string;
  tokenType: TokenType;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}
