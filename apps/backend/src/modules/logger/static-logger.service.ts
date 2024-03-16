import { Injectable, Logger } from '@nestjs/common';
import { NodeEnv } from '../../shared/types/node-env';
import { StaticLoggerArgs } from './logger.type';

@Injectable()
export class StaticLoggerService extends Logger {
  static log({ message, context, optionalParams }: StaticLoggerArgs) {
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

  static fatal({
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

  static error({
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

  static warn({
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

  static debug({
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

  static verbose({
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
