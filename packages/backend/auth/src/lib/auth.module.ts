import { StaticLoggerService } from '@backend/logger';
import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AUTH_MODULE_OPTIONS } from './auth.constants';
import { AuthController } from './auth.controller';
import { fusionAuthClientFactory } from './factory-providers/fusionauth-client.factory-provider';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { JwtStrategy } from './jwt.strategy';
import { RoleValidatorMiddlewareFactory } from './role-validator.middleware';
import { AuthService } from './services/auth.service';
import { FusionAuthErrorSerializer } from './services/fusionauth-error-serializer.service';
import {
  AuthModuleAsyncOptions,
  AuthModuleOptions,
  AuthOptionsFactory,
} from './types/auth.type';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [
    RoleGuard,
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    FusionAuthErrorSerializer,
    RoleValidatorMiddlewareFactory,
    fusionAuthClientFactory,
  ],
  exports: [
    RoleGuard,
    AuthService,
    JwtAuthGuard,
    RoleValidatorMiddlewareFactory,
  ],
})
export class AuthModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    StaticLoggerService.log({
      context: 'AuthModule',
      message: `Application is shuting down with signal: ${signal}`,
    });
  }

  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      global: true,
    };
  }

  static forRootAsync(
    options: AuthModuleAsyncOptions,
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      global: true,
      module: AuthModule,
      imports: options.imports,
      providers: [...asyncProviders],
    };
  }

  private static createAsyncProviders(
    options: AuthModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<AuthOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: AuthModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AUTH_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // `as Type<AuthModuleOptions>[]` is a workaround for TypeScript#2322
    const inject = [
      options.useClass || options.useExisting,
    ] as Type<AuthOptionsFactory>[];

    return {
      provide: AUTH_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AuthOptionsFactory) => {
        const createdAuthOptions =
          await optionsFactory.createAuthOptions();

        return createdAuthOptions;
      },
      inject,
    };
  }
}
