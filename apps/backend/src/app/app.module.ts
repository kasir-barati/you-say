import { AuthModule } from '@backend/auth';
import { HttpExceptionFilter } from '@backend/common';
import { LoggerModule } from '@backend/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { NewsletterSubscriptionModule } from '../modules/newsletter-subscription/newsletter-subscription.module';
import { PostModule } from '../modules/post/post.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './configs/app.config';
import { AuthModuleConfig } from './configs/auth.config';
import corsConfig from './configs/cors.config';
import helmetConfig from './configs/helmet.config';
import { LoggerModuleConfig } from './configs/logger.config';
import { MongooseModuleConfig } from './configs/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [appConfig, corsConfig, helmetConfig],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: MongooseModuleConfig,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: LoggerModuleConfig,
    }),
    AuthModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: AuthModuleConfig,
    }),
    NewsletterSubscriptionModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
