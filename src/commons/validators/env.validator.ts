import { plainToInstance } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    validateSync,
} from 'class-validator';

import { NodeEnv } from 'src/contracts/types/web.type';
import {
    app_exposed_port_should_be_integer,
    app_host_should_be_string,
    app_port_should_be_integer,
    node_env_is_invalid,
    sa_password_should_be_string,
    sa_username_should_be_string,
    swagger_path_should_be_string,
    required_environment_variables_loading_failed,
} from 'src/contracts/other-errors/error-codes.json';

class EnvironmentVariables {
    @IsEnum(NodeEnv, { message: node_env_is_invalid })
    NODE_ENV!: NodeEnv;

    @IsOptional()
    @IsString({ message: sa_username_should_be_string })
    SA_USERNAME?: string;

    @IsOptional()
    @IsString({ message: sa_password_should_be_string })
    SA_PASSWORD?: string;

    @IsString({ message: app_host_should_be_string })
    APP_HOST!: string;

    @IsInt({ message: app_port_should_be_integer })
    APP_PORT!: number;

    @IsInt({ message: app_exposed_port_should_be_integer })
    APP_EXPOSED_PORT!: number;

    @IsOptional()
    @IsString({ message: swagger_path_should_be_string })
    SWAGGER_PATH?: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfigs = plainToInstance(
        EnvironmentVariables,
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
