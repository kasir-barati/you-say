import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserWithRelations } from '../users/types/user.type';
import { UsersService } from '../users/users.service';
import authConfig from './configs/auth.config';
import { LoginUserRequestDto } from './dto';
import { JwtToken } from './types/jwt-token.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(authConfig.KEY)
        private readonly authConfigs: ConfigType<typeof authConfig>,
    ) {}

    async login(user: UserWithRelations): Promise<JwtToken> {
        const payload = {
            userId: user.id,
        };
        const accessToken = this.jwtService.signAsync(payload, {
            secret: this.authConfigs.jwtSecret,
            expiresIn: this.authConfigs.accessTokenTtl,
        });
        const refreshToken = this.jwtService.signAsync(payload, {
            secret: this.authConfigs.jwtSecret,
            expiresIn: this.authConfigs.refreshTokenTtl,
        });

        return {
            accessToken: await accessToken,
            refreshToken: await refreshToken,
        };
    }

    async loginValidate(loginUser: LoginUserRequestDto) {
        const { username, password } = loginUser;
        const user = this.usersService.getOne({
            where: {
                username,
            },
        });

        if (!(await user)) {
            return;
        }

        const isPasswordCorrect = this.usersService.comparePassword({
            plainTextPassword: password,
            hashedPassword: (await user).hashedPassword,
        });

        if (!(await isPasswordCorrect)) {
            return;
        }
        // TODO: Log user attempt in the db
        // TODO: Send email to the user to inform them, I guess this should happen on suspicious activities
        // TODO: Pass the IP and headers to this service or use interceptor

        return user;
    }
}
