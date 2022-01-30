import { registerAs } from '@nestjs/config';
import { format, transports } from 'winston';
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModuleOptions,
} from 'nest-winston';

export default registerAs(
    'loggerConfigs',
    (): WinstonModuleOptions | never => ({
        format: format.combine(format.timestamp()),
        transports: [
            new transports.Console({
                format: format.combine(
                    format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
            }),
            new transports.File({
                format: format.combine(
                    format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
                filename: 'app.log',
            }),
        ],
        // Handling Uncaught Exceptions with winston
        handleExceptions: true,
        exitOnError: false,
        exceptionHandlers: [
            new transports.File({
                format: format.combine(
                    format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
                filename: 'app.exceptions.log',
            }),
        ],
    }),
);
