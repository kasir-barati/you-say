import { Inject, Logger } from '@nestjs/common';
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
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { DATABASE_URL, MONGO_INITDB_DATABASE } =
      this.webAppConfigs;

    Logger.log(
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
