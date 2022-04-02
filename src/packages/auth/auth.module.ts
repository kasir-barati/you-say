import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthStrategy } from './local-auth/local-auth.strategy';
import { UsersModule } from '../users/users.module';
import authConfig from './configs/auth.config';

@Module({
    imports: [UsersModule, ConfigModule.forFeature(authConfig)],
    controllers: [AuthController],
    providers: [AuthService, LocalAuthStrategy],
})
export class AuthModule {}
