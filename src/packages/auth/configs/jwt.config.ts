import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import authConfig from './auth.config';

export function jwtModuleFactory(
    authConfigs: ConfigType<typeof authConfig>,
): JwtModuleOptions {
    return {
        secret: authConfigs.jwtSecret,
        signOptions: {
            expiresIn: authConfigs.accessTokenTtl,
        },
    };
}
