import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthStrategy } from './local-auth/local-auth.strategy';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import authConfig from './configs/auth.config';
import { jwtModuleFactory } from './configs/jwt.config';

@Module({
    imports: [
        UsersModule,
        ConfigModule.forFeature(authConfig),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: jwtModuleFactory,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalAuthStrategy, JwtStrategy],
})
export class AuthModule {}
