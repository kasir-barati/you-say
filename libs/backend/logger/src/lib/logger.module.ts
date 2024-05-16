import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';
import { LoggerService } from './logger.service';
import {
  LoggerModuleAsyncOptions,
  LoggerModuleOptions,
  LoggerOptionsFactory,
} from './logger.type';

@Global()
@Module({})
export class LoggerModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string | undefined) {
    console.info('loggerModule shuting down with signal: ', signal);
  }

  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  static forRootAsync(
    options: LoggerModuleAsyncOptions,
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      imports: options.imports,
      module: LoggerModule,
      providers: [...asyncProviders, LoggerService],
      exports: [LoggerService],
    };
  }

  private static createAsyncProviders(
    options: LoggerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<LoggerOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: LoggerModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: LOGGER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // `as Type<LoggerOptionsFactory>[]` is a workaround for TypeScript#2322
    const inject = [
      options.useClass || options.useExisting,
    ] as Type<LoggerOptionsFactory>[];

    return {
      provide: LOGGER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: LoggerOptionsFactory) => {
        return await optionsFactory.createLoggerOptions();
      },
      inject,
    };
  }
}
