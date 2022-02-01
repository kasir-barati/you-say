// import {
//     ExceptionFilter,
//     Catch,
//     ArgumentsHost,
//     HttpException,
//     HttpStatus,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// import { LoggerService } from './logger.service';

// @Catch()
// export class AllExceptionFilter implements ExceptionFilter {
//     constructor(private loggerService: LoggerService) {}

//     catch(exception: unknown, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();
//         const request = ctx.getRequest<Request>();
//         const statusCode =
//             exception instanceof HttpException
//                 ? exception.getStatus()
//                 : HttpStatus.INTERNAL_SERVER_ERROR;

//         let loggerDto = new LoggerHttpDto();
//         loggerDto = LoggerHttpHelper.formatRequest(
//             request,
//             loggerDto,
//         );
//         loggerDto = LoggerHttpHelper.formatResponse(
//             response,
//             loggerDto,
//             JSON.stringify(exception),
//         );

//         const isWarn = statusCode >= 400 && statusCode < 500;
//         const isError = statusCode >= 500;

//         this.loggerService.error(loggerDto);
//         if (isError) {
//             this.loggerService.error(loggerDto);
//         } else if (isWarn) {
//             this.loggerService.warn(loggerDto);
//         }

//         response.status(statusCode).json({
//             statusCode: statusCode,
//             timestamp: new Date().toISOString(),
//             path: request.url,
//             exception: exception,
//         });
//     }
// }
