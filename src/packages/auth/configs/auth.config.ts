import { registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsInt, IsString, validateSync } from 'class-validator';

import { AuthConfig } from '../types/auth-config.type';

export default registerAs('authConfigs', (): AuthConfig => {
    const config: AuthConfig = {
        jwtSecret: process.env.JWT_SECRET,
        accessTokenTtl: +process.env.ACCESS_TOKEN_TTL,
        refreshTokenTtl: +process.env.REFRESH_TOKEN_TTL,
    };

    validate(config as unknown as any);

    return config;
});

class EnvironmentVariables {
    @IsString()
    JWT_SECRET: string;

    @IsInt()
    ACCESS_TOKEN_TTL: number;

    @IsInt()
    REFRESH_TOKEN_TTL: number;
}

function validate(config: Record<string, unknown>) {
    const validatedConfigs = plainToClass(
        EnvironmentVariables,
        config,
        {
            enableImplicitConversion: true,
        },
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
            errorCode:
                'required_environment_variables_loading_failed',
            message:
                'Application could not load required environment variables',
        });
        throw new Error(validatedConfigsErrors.toString());
    }

    return validatedConfigs;
}
