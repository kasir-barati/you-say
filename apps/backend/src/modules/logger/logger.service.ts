import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NodeEnv } from '@shared';
import appConfig from '../../app/configs/app.config';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {
    super();
  }

  setContext(context: string): void {
    super.setContext(context);
  }

  log(message: unknown, context?: string): void;
  log(message: unknown, optionalParams?: unknown): void;
  log(message: unknown, contextOrOptionalParams?: unknown): void {
    if (this.appConfigs.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (typeof contextOrOptionalParams === 'string') {
      this.setContext(contextOrOptionalParams);
    }

    if (contextOrOptionalParams !== undefined) {
      super.log(message, contextOrOptionalParams);
      return;
    }

    super.log(message);
  }

  fatal(message: unknown, context?: string): void;
  fatal(message: unknown, optionalParams?: unknown): void;
  fatal(message: unknown, contextOrOptionalParams?: unknown): void {
    if (this.appConfigs.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (typeof contextOrOptionalParams === 'string') {
      super.setContext(contextOrOptionalParams);
    }

    if (contextOrOptionalParams !== undefined) {
      super.fatal(message, contextOrOptionalParams);
      return;
    }

    super.fatal(message);
  }

  error(message: unknown, context?: string): void;
  error(message: unknown, optionalParams?: unknown): void;
  error(message: unknown, contextOrOptionalParams?: unknown): void {
    if (this.appConfigs.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (typeof contextOrOptionalParams === 'string') {
      super.setContext(contextOrOptionalParams);
    }

    if (contextOrOptionalParams !== undefined) {
      super.error(message, contextOrOptionalParams);
      return;
    }

    super.error(message);
  }

  warn(message: unknown, context?: string): void;
  warn(message: unknown, optionalParams?: unknown): void;
  warn(message: unknown, contextOrOptionalParams?: unknown): void {
    if (this.appConfigs.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (typeof contextOrOptionalParams === 'string') {
      super.setContext(contextOrOptionalParams);
    }

    if (contextOrOptionalParams !== undefined) {
      super.warn(message, contextOrOptionalParams);
      return;
    }

    super.warn(message);
  }

  debug(message: unknown, context?: string): void;
  debug(message: unknown, optionalParams?: unknown): void;
  debug(message: unknown, contextOrOptionalParams?: unknown): void {
    if (this.appConfigs.NODE_ENV !== NodeEnv.development) {
      return;
    }

    if (typeof contextOrOptionalParams === 'string') {
      super.setContext(contextOrOptionalParams);
    }

    if (contextOrOptionalParams !== undefined) {
      super.debug(message, contextOrOptionalParams);
      return;
    }

    super.debug(message);
  }

  verbose(message: unknown, context?: string): void;
  verbose(message: unknown, optionalParams?: unknown): void;
  verbose(message: unknown, contextOrOptionalParams?: unknown) {
    if (this.appConfigs.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (typeof contextOrOptionalParams === 'string') {
      super.setContext(contextOrOptionalParams);
    }

    if (contextOrOptionalParams !== undefined) {
      super.verbose(message, contextOrOptionalParams);
      return;
    }

    super.verbose(message);
  }
}
