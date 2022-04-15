import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';

import authConfig from '../configs/auth.config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        authConfigs: ConfigType<typeof authConfig>,
        private userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authConfigs.jwtSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.userService.getOne({
            where: {
                id: payload.sub,
            },
            include: {
                Account: true,
            },
        });

        return user;
    }
}
