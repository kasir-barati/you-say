import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NotFoundError } from 'rxjs';
import { LoggerService } from '../../modules/logger/logger.service';
import { BadRequestError } from '../contracts/bad-request-error.contract';
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
    this.loggerService.error(
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message,
      HttpExceptionFilter.name,
    );
    this.loggerService.error(
      exception.stack,
      HttpExceptionFilter.name,
    );

    if (
      exception instanceof BadRequestError ||
      exception.message === 'Bad Request Exception'
    ) {
      this.loggerService.debug(message, HttpExceptionFilter.name);
      return 400;
    }
    if (exception instanceof NotFoundError) {
      this.loggerService.debug(message, HttpExceptionFilter.name);
      return 404;
    }
    if (exception instanceof UniqueError) {
      this.loggerService.debug(message, HttpExceptionFilter.name);
      return 409;
    }

    return exception?.['statusCode'] ?? 500;
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
