import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NotFoundError } from 'rxjs';
import { BadRequestError } from '../contracts/bad-request-error.contract';
import { ForbiddenError } from '../contracts/forbidden-error.contract';
import { UniqueError } from '../contracts/unique-error';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter, OnModuleInit
{
  private logger: Logger;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  onModuleInit() {
    this.logger = new Logger(HttpExceptionFilter.name);
  }

  catch(exception: Error | HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const message = this.getErrorMessage(exception);
    const statusCode = this.getStatusCode(exception, message);
    const responseBody = {
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }

  private getStatusCode(
    exception: Error | HttpException,
    message: string | string[],
  ): number {
    this.logger.error(
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message,
    );
    this.logger.error(exception.stack);

    if (exception instanceof BadRequestError) {
      this.logger.debug(message);
      return 400;
    }
    if (exception instanceof ForbiddenError) {
      this.logger.debug(message);
      return 403;
    }
    if (exception instanceof NotFoundError) {
      this.logger.debug(message);
      return 404;
    }
    if (exception instanceof UniqueError) {
      this.logger.debug(message);
      return 409;
    }

    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(
    exception: Error | HttpException,
  ): string | string[] {
    const errorMessages = exception?.['response']?.message;
    const isBadRequest =
      exception.message === 'Bad Request Exception';
    const hasMultipleErrorMessages =
      errorMessages &&
      Array.isArray(errorMessages) &&
      errorMessages.length > 0;
    const isValidationError =
      isBadRequest && hasMultipleErrorMessages;
    const result = isValidationError
      ? errorMessages
      : exception.message;

    return result;
  }
}
