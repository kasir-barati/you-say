import { Role } from './role.type';

export interface DecodedIdToken {
  family_name: string;
  given_name: string;
  picture: string;
  sub: string;
  roles: Role[] | null;
  aud: string;
  exp: number;
  iat: number;
  settings: unknown;
  iss: string;
  jti: string;
  authenticationType: 'PASSWORD';
  email: string;
  email_verified: boolean;
  preferred_username: string;
  at_hash: string;
  c_hash: string;
  scope: string;
  nonce: string;
  sid: string;
  auth_time: number;
  tid: string;
  applicationId: string;
  tenant: unknown;
}
