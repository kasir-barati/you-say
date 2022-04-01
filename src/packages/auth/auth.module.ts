import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthService } from './local-auth/local-auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalAuthService],
})
export class AuthModule {}
