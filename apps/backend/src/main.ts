import { LoggerService } from '@backend/logger';
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

async function bootstrap() {
  let swaggerUrl: string | undefined;
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  const { SWAGGER_PATH, APP_PORT, APP_BASE_URL } = app.get<
    ConfigType<typeof appConfig>
  >(appConfig.KEY);
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
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
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
    swaggerUrl = `${APP_BASE_URL}/${SWAGGER_PATH}`;
  }

  await app.listen(APP_PORT);
  loggerService.log(
    `🚀 Application is running on: ${APP_BASE_URL}`,
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
