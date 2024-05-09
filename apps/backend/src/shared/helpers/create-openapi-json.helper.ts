import {
  AuthController,
  AuthService,
  MobileAuthController,
  MobileAuthService,
} from '@backend/auth';
import {
  createSwaggerConfiguration,
  writeOpenApi,
} from '@backend/common';
import { StaticLoggerService } from '@backend/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import { AppController } from '../../app/app.controller';
import { AppService } from '../../app/app.service';
import appConfig from '../../app/configs/app.config';
import { NewsletterSubscriptionController } from '../../modules/newsletter-subscription/newsletter-subscription.controller';
import { NewsletterSubscriptionService } from '../../modules/newsletter-subscription/newsletter-subscription.service';
import { PostController } from '../../modules/post/post.controller';
import { PostService } from '../../modules/post/services/post.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [appConfig],
      cache: true,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    PostController,
    MobileAuthController,
    NewsletterSubscriptionController,
  ],
  providers: [
    { provide: AppService, useValue: Sinon.stub(AppService) },
    { provide: AuthService, useValue: Sinon.stub(AuthService) },
    { provide: PostService, useValue: Sinon.stub(PostService) },
    {
      provide: NewsletterSubscriptionService,
      useValue: Sinon.stub(NewsletterSubscriptionService),
    },
    {
      provide: MobileAuthService,
      useValue: Sinon.stub(MobileAuthService),
    },
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
