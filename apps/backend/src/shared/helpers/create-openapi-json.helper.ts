import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import { AppController } from '../../app/app.controller';
import { AppService } from '../../app/app.service';
import appConfig from '../../app/configs/app.config';
import { AuthController } from '../../modules/auth/auth.controller';
import fusionAuthConfig from '../../modules/auth/configs/fusion-auth.config';
import { AuthService } from '../../modules/auth/services/auth.service';
import { StaticLoggerService } from '../../modules/logger/static-logger.service';
import { createSwaggerConfiguration } from './create-swagger-configuration.helper';
import { writeOpenApi } from './generate-openapi.helper';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [appConfig, fusionAuthConfig],
      cache: true,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    { provide: AppService, useValue: Sinon.stub(AppService) },
    { provide: AuthService, useValue: Sinon.stub(AuthService) },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const APP_PORT = 3001;
  const app = await NestFactory.create(OpenApiModule);
  const document = createSwaggerConfiguration({
    app,
    title: 'The you-say RESTful API',
    description: '',
    url: `http://localhost:${APP_PORT}`,
  });
  const openApiOutputDirectory = join(
    process.cwd(),
    'apps',
    'backend',
  );
  const openApiFilePath = writeOpenApi(
    document,
    openApiOutputDirectory,
  );

  StaticLoggerService.log({
    message: `OpenAPI specification created: ${openApiFilePath}`,
    context: 'OpenApiModule',
  });
}

createOpenApi()
  .then(() => {
    StaticLoggerService.log({
      message: 'OpenAPI specification created',
      context: 'OpenApiModule',
    });
    process.exit(0);
  })
  .catch(
    StaticLoggerService.error.bind(this, {
      message: 'OpenAPI specification failed to be created',
      context: 'OpenApiModule',
    }),
  );
