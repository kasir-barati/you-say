import { plainToInstance } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    validateSync,
} from 'class-validator';

import { WinstonDefaultLogLevels } from '../logger.type';
import {
    is_rotate_logger_files_activated_should_be_boolean,
    logger_max_files_should_be_string,
    logger_max_size_should_be_string,
    logger_level_is_invalid,
    logger_name_should_be_string,
} from '../contracts/other-errors/error-codes.json';
import { required_environment_variables_loading_failed } from '@you-say/src/shared/contracts/other-errors/error-codes.json';

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

export function validate(config: Record<string, unknown>) {
    const validatedConfigs = plainToInstance(
        LoggerEnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );
    const validatedConfigsErrors = validateSync(validatedConfigs, {
        skipMissingProperties: false,
    });

    if (validatedConfigsErrors.length > 0) {
        console.dir({
            errors: validatedConfigsErrors.map((error) => ({
                value: error.value,
                property: error.property,
                message: Object.values(error.constraints!)[0],
            })),
            errorCode: required_environment_variables_loading_failed,
            message:
                'Application could not load required environment variables',
        });
        throw new Error(validatedConfigsErrors.toString());
    }

    return validatedConfigs;
}
