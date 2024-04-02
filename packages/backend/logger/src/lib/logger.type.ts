import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { NodeEnv } from '@shared';

export interface LoggerModuleOptions {
  nodeEnv: NodeEnv;
}
export interface LoggerOptionsFactory {
  createLoggerOptions():
    | Promise<LoggerModuleOptions>
    | LoggerModuleOptions;
}
export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<LoggerOptionsFactory>;
  useClass?: Type<LoggerOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<LoggerOptionsFactory> | LoggerOptionsFactory;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
}
export interface StaticLoggerArgs {
  message: unknown;
  context?: string;
  optionalParams?: unknown;
}
