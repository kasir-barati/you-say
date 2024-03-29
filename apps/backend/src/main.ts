import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import appConfig from './app/configs/app.config';
import corsConfig from './app/configs/cors.config';
import helmetConfig from './app/configs/helmet.config';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  const APP_PORT = 3001;
  let swaggerUrl: string | undefined;
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  const { SWAGGER_PATH } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const corsConfigs = app.get<ConfigType<typeof corsConfig>>(
    corsConfig.KEY,
  );
  const helmetConfigs = app.get<ConfigType<typeof helmetConfig>>(
    helmetConfig.KEY,
  );

  app.useLogger(loggerService);
  app.use(json({ limit: '20mb' }));
  app.use(cookieParser());
  app.use(helmet(helmetConfigs));
  app.enableCors(corsConfigs);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 400,
    }),
  );

  if (SWAGGER_PATH) {
    // initialize Swagger using the SwaggerModule class
    const documentBuilderConfig = new DocumentBuilder()
      .setTitle('You-Say API')
      .setDescription('The You-Say RESTful API')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      })
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      documentBuilderConfig,
    );

    SwaggerModule.setup(SWAGGER_PATH, app, swaggerDocument);
    swaggerUrl = `http://localhost:${APP_PORT}/${SWAGGER_PATH}`;
  }

  await app.listen(APP_PORT);
  loggerService.log(
    `🚀 Application is running on: http://localhost:${APP_PORT}`,
    'NestApplication',
  );
  if (swaggerUrl) {
    loggerService.log(
      `🚀 Swagger is running on: ${swaggerUrl}`,
      'NestApplication',
    );
  }
}

bootstrap();
