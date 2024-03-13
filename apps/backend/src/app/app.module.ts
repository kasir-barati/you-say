import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from '../modules/auth/auth.module';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './configs/app.config';
import corsConfig from './configs/cors.config';
import helmetConfig from './configs/helmet.config';
import { MongooseModuleConfig } from './configs/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [appConfig, corsConfig, helmetConfig],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: MongooseModuleConfig,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
