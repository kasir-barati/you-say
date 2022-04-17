import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import authConfig from './auth.config';

export class JwtModuleConfig implements JwtOptionsFactory {
    constructor(
        @Inject(authConfig.KEY)
        private readonly authConfigs: ConfigType<typeof authConfig>,
    ) {}

    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        return {
            secret: this.authConfigs.jwtSecret,
            signOptions: {
                expiresIn: this.authConfigs.accessTokenTtl,
            },
        };
    }
}
