import { LoggerService } from '@backend/logger';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { SinonMock, SinonMockType } from '@shared';
import * as sinon from 'sinon';
import { BadRequestError } from '../contracts/bad-request-error.contract';
import { ForbiddenError } from '../contracts/forbidden-error.contract';
import { FusionOAuthError } from '../contracts/fusionauth-error.contract';
import { NotFoundError } from '../contracts/not-found-error.contract';
import { UniqueError } from '../contracts/unique-error';
import { HttpExceptionFilter } from './http-exception.filter';

type ErrorWithResponse = Error & {
  response: { message: string[] };
};

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let httpAdapter: SinonMockType<AbstractHttpAdapter>;
  let httpAdapterHost: SinonMockType<HttpAdapterHost>;
  let argumentsHost: SinonMockType<ArgumentsHost>;
  let loggerService: SinonMockType<LoggerService>;

  beforeEach(() => {
    httpAdapter = SinonMock.with<AbstractHttpAdapter>({});
    httpAdapterHost = SinonMock.of<HttpAdapterHost>(HttpAdapterHost, {
      httpAdapter,
    });
    loggerService = SinonMock.of<LoggerService>(LoggerService);
    filter = new HttpExceptionFilter(httpAdapterHost, loggerService);
    argumentsHost = SinonMock.with<ArgumentsHost>({});
    const httpArgumentsHost = SinonMock.with<HttpArgumentsHost>({});
    argumentsHost.switchToHttp.returns(httpArgumentsHost);
  });

  it.each([
    ['path', 'message'],
    ['otherPath', 'someMessage'],
  ])(
    'should throw Http 400 error if BadRequestError was caught',
    (path: string, message: string) => {
      httpAdapter.getRequestUrl.returns(path);

      filter.catch(new BadRequestError(message), argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path,
          },
          400,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    ['path', 'message'],
    ['otherPath', 'someMessage'],
  ])(
    'should throw Http 403 error if Forbidden was caught',
    (path: string, message: string) => {
      httpAdapter.getRequestUrl.returns(path);

      filter.catch(new ForbiddenError(message), argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path,
          },
          403,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    ['path', 'message'],
    ['otherPath', 'someMessage'],
  ])(
    'should throw Http 409 error if UniqueError was caught',
    (path: string, message: string) => {
      httpAdapter.getRequestUrl.returns(path);

      filter.catch(new UniqueError(message), argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path,
          },
          409,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    ['path', 'message'],
    ['otherPath', 'someMessage'],
  ])(
    'should throw Http 404 error if NotFoundError was caught',
    (path: string, message: string) => {
      httpAdapter.getRequestUrl.returns(path);

      filter.catch(new NotFoundError(message), argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path,
          },
          404,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    ['message', 'path', 401],
    ['anotherMessage', 'anotherPath', 422],
  ])(
    'should throw status code of caught HttpException',
    (message: string, path: string, statusCode: number) => {
      httpAdapter.getRequestUrl.returns(path);

      filter.catch(
        new HttpException(message, statusCode),
        argumentsHost,
      );

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path,
          },
          statusCode,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    ['message', 'path'],
    ['anotherMessage', 'anotherPath'],
  ])(
    'should throw Http 500 if unknown Error was caught',
    (message: string, path: string) => {
      httpAdapter.getRequestUrl.returns(path);

      filter.catch(new Error(message), argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path,
          },
          500,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    [['message']],
    [['anotherMessage', 'anotherSecondMessage']],
  ])(
    'should map nested response messages if validation error with valid response structure is given',
    (messages: string[]) => {
      httpAdapter.getRequestUrl.returns('path');
      const error = new Error(
        'Bad Request Exception',
      ) as ErrorWithResponse;
      error.response = { message: messages };

      filter.catch(error, argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message: messages,
            timestamp: sinon.match.string,
            path: sinon.match.string,
          },
          sinon.match.number,
        ),
      ).toBeTruthy();
    },
  );

  it.each([['message'], ['anotherMessage']])(
    "should not map nested response messages if error message is not 'Bad Request Exception'",
    (message: string) => {
      httpAdapter.getRequestUrl.returns('path');
      const error = new Error(message) as ErrorWithResponse;
      error.response = {
        message: ['firstUnmappedMessage', 'secondUnmappedMessage'],
      };

      filter.catch(error, argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message,
            timestamp: sinon.match.string,
            path: sinon.match.string,
          },
          sinon.match.number,
        ),
      ).toBeTruthy();
    },
  );

  it.each([
    [
      'wrongOuterProp',
      { message: ['firstUnmappedMessage', 'secondUnmappedMessage'] },
    ],
    [
      'response',
      {
        wrongInnerProp: [
          'firstUnmappedMessage',
          'secondUnmappedMessage',
        ],
      },
    ],
  ])(
    'should not map nested response messages if nested error message is malformed',
    (
      outerProp: string,
      errorResponse: Record<string, Array<string>>,
    ) => {
      httpAdapter.getRequestUrl.returns('path');
      const error = new Error(
        'Bad Request Exception',
      ) as ErrorWithResponse;
      error[outerProp] = errorResponse;

      filter.catch(error, argumentsHost);

      expect(
        httpAdapter.reply.calledWith(
          sinon.match.any,
          {
            message: 'Bad Request Exception',
            timestamp: sinon.match.string,
            path: sinon.match.string,
          },
          sinon.match.number,
        ),
      ).toBeTruthy();
    },
  );

  it('should map error.message as message if there were not any message in the response object', () => {
    httpAdapter.getRequestUrl.returns('path');
    const error = new Error('Some error') as ErrorWithResponse;
    error.response = { message: [] };

    filter.catch(error, argumentsHost);

    expect(
      httpAdapter.reply.calledWith(
        sinon.match.any,
        {
          message: 'Some error',
          timestamp: sinon.match.string,
          path: sinon.match.string,
        },
        500,
      ),
    ).toBeTruthy();
  });

  it.each<FusionOAuthError>([
    new FusionOAuthError('Some error', 500),
    new FusionOAuthError('The user credentials are invalid.', 400),
  ])('should map FusionOAuthError: %o', (error) => {
    httpAdapter.getRequestUrl.returns('path');

    filter.catch(error, argumentsHost);

    expect(
      httpAdapter.reply.calledWith(
        sinon.match.any,
        {
          message: error.message,
          timestamp: sinon.match.string,
          path: sinon.match.string,
        },
        error.status,
      ),
    ).toBeTruthy();
  });
});
