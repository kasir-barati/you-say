import { registerAs } from '@nestjs/config';

import { LoggerConfig } from './logger.type';

export default registerAs(
    'loggerConfig',
    (): LoggerConfig => ({
        level: process.env.LOGGER_LEVEL,
        isRotateLoggerFilesActivated:
            process.env.IS_ROTATE_LOGGER_FILES_ACTIVATED,
        loggerMaxFile: process.env.LOGGER_MAX_FILES,
        loggerMaxSize: process.env.LOGGER_MAX_SIZE,
        loggerName: process.env?.LOGGER_NAME ?? 'you-say',
    }),
);
