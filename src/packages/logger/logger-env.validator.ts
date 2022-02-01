import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';

import { WinstonDefaultLogLevels } from './logger.type';
import {
    is_rotate_logger_files_activated_should_be_boolean,
    logger_max_files_should_be_string,
    logger_max_size_should_be_string,
    logger_level_is_invalid,
    logger_name_should_be_string,
} from './contracts/other-errors/error-codes.json';

export class LoggerEnvironmentVariables {
    @IsEnum(WinstonDefaultLogLevels, {
        message: logger_level_is_invalid,
    })
    LOGGER_LEVEL: WinstonDefaultLogLevels;

    @IsOptional()
    @IsString({ message: logger_max_size_should_be_string })
    LOGGER_MAX_SIZE: string;

    @IsOptional()
    @IsString({ message: logger_max_files_should_be_string })
    LOGGER_MAX_FILES: string;

    @IsBoolean({
        message: is_rotate_logger_files_activated_should_be_boolean,
    })
    IS_ROTATE_LOGGER_FILES_ACTIVATED: boolean;

    @IsString({ message: logger_name_should_be_string })
    LOGGER_NAME?: string;
}
