import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { User } from '@shared';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export interface AuthModuleOptions {
  fusionAuthHost: string;
  fusionAuthApiKey: string;
  fusionAuthIssuer: string;
  fusionAuthClientId: string;
  fusionAuthTenantId: string;
  fusionAuthAdminGroupId: string;
  fusionAuthApplicationId: string;
}
export interface AuthOptionsFactory {
  createAuthOptions(): Promise<AuthModuleOptions> | AuthModuleOptions;
}
export interface AuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AuthOptionsFactory>;
  useClass?: Type<AuthOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<AuthOptionsFactory> | AuthOptionsFactory;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
}
export const ROLES_KEY = 'roles';
export enum FusionAuthUserGroup {
  Admin = 'Admin',
}
