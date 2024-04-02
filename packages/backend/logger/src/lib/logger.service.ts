import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { NodeEnv } from '@shared';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';
import { LoggerModuleOptions } from './logger.type';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(
    @Inject(LOGGER_MODULE_OPTIONS)
    private readonly loggerModuleOptions: LoggerModuleOptions,
  ) {
    super();
  }

  override setContext(context: string): void {
    super.setContext(context);
  }

  override log(message: unknown, context?: string): void;
  override log(message: unknown, optionalParams?: unknown): void;
  override log(
    message: unknown,
    contextOrOptionalParams?: unknown,
  ): void {
    if (this.loggerModuleOptions.nodeEnv === NodeEnv.test) {
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

  override fatal(message: unknown, context?: string): void;
  override fatal(message: unknown, optionalParams?: unknown): void;
  override fatal(
    message: unknown,
    contextOrOptionalParams?: unknown,
  ): void {
    if (this.loggerModuleOptions.nodeEnv === NodeEnv.test) {
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

  override error(message: unknown, context?: string): void;
  override error(message: unknown, optionalParams?: unknown): void;
  override error(
    message: unknown,
    contextOrOptionalParams?: unknown,
  ): void {
    if (this.loggerModuleOptions.nodeEnv === NodeEnv.test) {
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

  override warn(message: unknown, context?: string): void;
  override warn(message: unknown, optionalParams?: unknown): void;
  override warn(
    message: unknown,
    contextOrOptionalParams?: unknown,
  ): void {
    if (this.loggerModuleOptions.nodeEnv === NodeEnv.test) {
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

  override debug(message: unknown, context?: string): void;
  override debug(message: unknown, optionalParams?: unknown): void;
  override debug(
    message: unknown,
    contextOrOptionalParams?: unknown,
  ): void {
    if (this.loggerModuleOptions.nodeEnv !== NodeEnv.development) {
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

  override verbose(message: unknown, context?: string): void;
  override verbose(message: unknown, optionalParams?: unknown): void;
  override verbose(
    message: unknown,
    contextOrOptionalParams?: unknown,
  ) {
    if (this.loggerModuleOptions.nodeEnv === NodeEnv.test) {
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
