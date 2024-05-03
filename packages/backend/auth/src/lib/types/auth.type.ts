import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export interface AuthModuleOptions {
  appBaseUrl: string;
  fusionAuthHost: string;
  fusionAuthApiKey: string;
  fusionAuthIssuer: string;
  fusionAuthTenantId: string;
  fusionAuthAdminGroupId: string;
  /**
   * @description This is the same as `clientId`
   */
  fusionAuthApplicationId: string;
  fusionAuthOauthConfigurationClientSecret: string;
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
