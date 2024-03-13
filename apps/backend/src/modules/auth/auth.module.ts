import FusionAuthClient from '@fusionauth/typescript-client';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { FusionAuthClientConfig } from './auth.type';
import fusionAuthConfig from './configs/fusion-auth.config';
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
    {
      provide: FusionAuthClient,
      inject: [ConfigService],
      useFactory(
        configsService: ConfigService<FusionAuthClientConfig>,
      ) {
        const FUSIONAUTH_API_KEY = configsService.get(
          'FUSIONAUTH_API_KEY',
        );
        const FUSIONAUTH_HOST = configsService.get('FUSIONAUTH_HOST');
        const FUSIONAUTH_TENANT_ID = configsService.get(
          'FUSIONAUTH_TENANT_ID',
        );

        return new FusionAuthClient(
          FUSIONAUTH_API_KEY,
          FUSIONAUTH_HOST,
          FUSIONAUTH_TENANT_ID,
        );
      },
    },
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
