import { registerAs } from '@nestjs/config';

import { LoggerConfig } from './logger.type';
import { validate } from './validators/env.validator';

export default registerAs('loggerConfig', (): LoggerConfig => {
    validate(process.env);

    return {
        level: process.env.LOGGER_LEVEL,
        isRotateLoggerFilesActivated:
            process.env.IS_ROTATE_LOGGER_FILES_ACTIVATED,
        loggerMaxFile: process.env.LOGGER_MAX_FILES,
        loggerMaxSize: process.env.LOGGER_MAX_SIZE,
        loggerName: process.env?.LOGGER_NAME ?? 'you-say',
    };
});
