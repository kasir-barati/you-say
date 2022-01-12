import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export function winstonConfigsGenerator():
    | {
          loggerOptions: winston.LoggerOptions;
      }
    | never {
    const loggerOptions: winston.LoggerOptions = {
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
            }),
            new winston.transports.File({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
                filename: 'app.log',
            }),
        ],
    };
    return {
        loggerOptions,
    };
}
