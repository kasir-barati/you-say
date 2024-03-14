import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import fusionAuthConfig from './configs/fusion-auth.config';
import { fusionAuthClientFactory } from './fusionauth-client.factory';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { JwtStrategy } from './jwt.strategy';
import { RoleValidatorMiddlewareFactory } from './role-validator.middleware';
import { AuthService } from './services/auth.service';
import { FusionAuthErrorSerializer } from './services/fusionauth-error-serializer.service';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(fusionAuthConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    RoleGuard,
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    FusionAuthErrorSerializer,
    RoleValidatorMiddlewareFactory,
    fusionAuthClientFactory,
  ],
  controllers: [AuthController],
  exports: [
    RoleGuard,
    AuthService,
    JwtAuthGuard,
    RoleValidatorMiddlewareFactory,
  ],
})
export class AuthModule {}
