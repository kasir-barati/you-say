import {
  LoggerModuleOptions,
  LoggerOptionsFactory,
} from '@backend/logger';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';

export class LoggerModuleConfig implements LoggerOptionsFactory {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}

  createLoggerOptions():
    | LoggerModuleOptions
    | Promise<LoggerModuleOptions> {
    return {
      nodeEnv: this.appConfigs.NODE_ENV,
    };
  }
}
