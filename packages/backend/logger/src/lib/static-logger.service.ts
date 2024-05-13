import { Injectable, Logger } from '@nestjs/common';
import { NodeEnv } from '@shared';
import { StaticLoggerArgs } from './logger.type';

@Injectable()
export class StaticLoggerService extends Logger {
  static override log({
    message,
    context,
    optionalParams,
  }: StaticLoggerArgs) {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (context) {
      super.log(message, context);
      return;
    }

    if (optionalParams) {
      super.log(message, optionalParams);
      return;
    }

    super.log(message);
  }

  static override fatal({
    message,
    context,
    optionalParams,
  }: StaticLoggerArgs) {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (context) {
      super.fatal(message, context);
      return;
    }

    if (optionalParams) {
      super.fatal(message, optionalParams);
      return;
    }

    super.fatal(message);
  }

  static override error({
    message,
    context,
    optionalParams,
  }: StaticLoggerArgs) {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (context) {
      super.error(message, context);
      return;
    }

    if (optionalParams) {
      super.error(message, optionalParams);
      return;
    }

    super.error(message);
  }

  static override warn({
    message,
    context,
    optionalParams,
  }: StaticLoggerArgs) {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (context) {
      super.warn(message, context);
      return;
    }

    if (optionalParams) {
      super.warn(message, optionalParams);
      return;
    }

    super.warn(message);
  }

  static override debug({
    message,
    context,
    optionalParams,
  }: StaticLoggerArgs) {
    if (process.env.NODE_ENV !== NodeEnv.development) {
      return;
    }

    if (context) {
      super.debug(message, context);
      return;
    }

    if (optionalParams) {
      super.debug(message, optionalParams);
      return;
    }

    super.debug(message);
  }

  static override verbose({
    message,
    context,
    optionalParams,
  }: StaticLoggerArgs) {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    if (context) {
      super.verbose(message, context);
      return;
    }

    if (optionalParams) {
      super.verbose(message, optionalParams);
      return;
    }

    super.verbose(message);
  }
}
