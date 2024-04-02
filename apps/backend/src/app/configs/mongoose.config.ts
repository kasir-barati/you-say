import { LoggerService } from '@backend/logger';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import webAppConfig from './app.config';

export class MongooseModuleConfig implements MongooseOptionsFactory {
  constructor(
    @Inject(webAppConfig.KEY)
    private readonly webAppConfigs: ConfigType<typeof webAppConfig>,
    private readonly loggerService: LoggerService,
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { DATABASE_URL, MONGO_INITDB_DATABASE } =
      this.webAppConfigs;

    this.loggerService.log(
      `MongoDB connection string: ${DATABASE_URL}/${MONGO_INITDB_DATABASE}`,
      'NestApplication',
    );

    return {
      autoIndex: true,
      autoCreate: true,
      retryAttempts: 10,
      retryDelay: 30,
      uri: DATABASE_URL,
      dbName: MONGO_INITDB_DATABASE,
    };
  }
}
