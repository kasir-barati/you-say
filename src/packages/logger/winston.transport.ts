import { join } from 'path';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { format, transport, transports } from 'winston';
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModuleOptions,
} from 'nest-winston';

import { LoggerConfig } from './logger.type';

export function winstonTransports(
    loggerConfig: LoggerConfig,
): WinstonModuleOptions | never {
    const {
        loggerMaxFile,
        loggerMaxSize,
        loggerName,
        level,
        isRotateLoggerFilesActivated,
    } = loggerConfig;
    // TODO: Add your transport for PLG/EFK stack
    const transporters: transport[] = [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
            ),
            level,
        }),
    ];
    const exceptionHandlers: any[] = [];
    const logsDirectory = join(__dirname, '..', '..', '..', 'logs');
    const defaultLogsDirectoryPath = join(
        logsDirectory,
        loggerName,
        'default',
    );
    const exceptionsLogsDirectoryPath = join(
        logsDirectory,
        loggerName,
        'exception',
    );

    if (isRotateLoggerFilesActivated) {
        const winstonDailyRotateFile = new WinstonDailyRotateFile({
            filename: `%DATE%.log`,
            format: format.combine(
                format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
            ),
            dirname: defaultLogsDirectoryPath,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: loggerMaxSize,
            maxFiles: loggerMaxFile,
            level,
        });
        const winstonDailyRotateFileExceptionHandlers =
            new WinstonDailyRotateFile({
                filename: `%DATE%.log`,
                format: format.combine(
                    format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
                dirname: exceptionsLogsDirectoryPath,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: loggerMaxSize,
                maxFiles: loggerMaxFile,
                level,
            });

        transporters.push(winstonDailyRotateFile);
        exceptionHandlers.push(
            winstonDailyRotateFileExceptionHandlers,
        );
    } else {
        const fileTransports = new transports.File({
            format: format.combine(
                format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
            ),
            filename: 'app.log',
            dirname: defaultLogsDirectoryPath,
            level,
        });
        const fileExceptionHandler = new transports.File({
            format: format.combine(
                format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
            ),
            filename: 'app.exceptions.log',
            dirname: exceptionsLogsDirectoryPath,
            level,
        });

        transporters.push(fileTransports);
        exceptionHandlers.push(fileExceptionHandler);
    }

    return {
        format: format.combine(format.timestamp()),
        transports: transporters,
        // Handling Uncaught Exceptions with winston
        handleExceptions: true,
        exitOnError: false,
        exceptionHandlers,
    };
}
