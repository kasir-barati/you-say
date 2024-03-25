declare module 'express' {
  interface Request {
    user?: User;
  }
}

export const ROLES_KEY = 'roles';
// TODO: remove this and use shared one
export enum Role {
  PostReader = 'PostReader',
  PostCreator = 'PostCreator',
  FileUploader = 'FileUploader',
}
export interface FusionAuthClientConfig {
  FUSIONAUTH_API_KEY: string;
  FUSIONAUTH_HOST: string;
  FUSIONAUTH_TENANT_ID: string;
  FUSIONAUTH_APPLICATION_ID: string;
  FUSIONAUTH_ADMIN_GROUP_ID: string;
  FUSIONAUTH_ISSUER: string;
  FUSIONAUTH_CLIENT_ID: string;
}
export enum FusionAuthUserGroup {
  Admin = 'Admin',
}
// TODO: remove this and use shared one
export interface User {
  sub: string;
  roles: Role[];
}
