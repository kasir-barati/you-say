import { Logger } from '@nestjs/common';
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
  const APP_PORT = 3001;
  const globalPrefix = 'api';
  let swaggerUrl: string | undefined;
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const { SWAGGER_PATH } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const corsConfigs = app.get<ConfigType<typeof corsConfig>>(
    corsConfig.KEY,
  );
  const helmetConfigs = app.get<ConfigType<typeof helmetConfig>>(
    helmetConfig.KEY,
  );

  app.use(json({ limit: '20mb' }));
  app.use(cookieParser());
  app.use(helmet(helmetConfigs));
  app.enableCors(corsConfigs);
  app.setGlobalPrefix(globalPrefix);

  if (SWAGGER_PATH) {
    // initialize Swagger using the SwaggerModule class
    const documentBuilderConfig = new DocumentBuilder()
      .setTitle('You-Say API')
      .setDescription('The You-Say RESTful API')
      .addBearerAuth({
        // TODO: bearer token from keycloak
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
  logger.log(
    `🚀 Application is running on: http://localhost:${APP_PORT}/${globalPrefix}`,
    'NestApplication',
  );
  if (swaggerUrl) {
    logger.log(
      `🚀 Swagger is running on: ${swaggerUrl}`,
      'NestApplication',
    );
  }
}

bootstrap();
