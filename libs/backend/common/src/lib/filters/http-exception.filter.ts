import { LoggerService } from '@backend/logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BadRequestError } from '../contracts/bad-request-error.contract';
import { ForbiddenError } from '../contracts/forbidden-error.contract';
import { FusionOAuthError } from '../contracts/fusionauth-error.contract';
import { NotFoundError } from '../contracts/not-found-error.contract';
import { UniqueError } from '../contracts/unique-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: Error | HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const message = this.getErrorMessage(exception);
    const statusCode = this.getStatusCode(exception);
    const path: string = httpAdapter.getRequestUrl(ctx.getRequest());
    const responseBody = {
      message,
      timestamp: new Date().toISOString(),
      path,
    };

    this.log({ path, statusCode, message, exception });
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }

  private log({
    path,
    message,
    exception,
    statusCode,
  }: {
    path: string;
    statusCode: number;
    message: string | string[];
    exception: Error | HttpException;
  }) {
    const error =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;
    this.loggerService.error(
      { error, message, path, statusCode },
      HttpExceptionFilter.name,
    );
    this.loggerService.debug(
      exception.stack,
      HttpExceptionFilter.name,
    );
  }

  private getStatusCode(exception: Error | HttpException): number {
    if (exception instanceof FusionOAuthError) {
      return exception.status;
    }

    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (
      exception.name === BadRequestError.name ||
      exception.message === 'Bad Request Exception'
    ) {
      return 400;
    }

    if (exception.name === NotFoundError.name) {
      return 404;
    }

    if (exception.name === UniqueError.name) {
      return 409;
    }

    if (exception.name === ForbiddenError.name) {
      return 403;
    }

    return exception?.['statusCode'] ?? 500;
  }

  private getErrorMessage(
    exception: Error | HttpException | FusionOAuthError,
  ): string | string[] {
    if (exception instanceof FusionOAuthError) {
      return exception.message;
    }

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
