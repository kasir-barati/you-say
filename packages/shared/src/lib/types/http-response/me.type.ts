import { Role } from '../role.type';

export interface MeResponse {
  applicationId: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  preferred_username: string;
  roles: Role[];
  scope: string;
  settings: unknown;
  sid: string;
  sub: string;
  tenant: unknown;
  tid: string;
}
