import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

// All general configs for RESTful API
import { corsConfigsGenerator } from './configs/cors.config';
import { helmetConfigsGenerator } from './configs/helmet.config';
import { webAppConfigs } from './contracts/types/web.type';

// All Middleware
import { csrfMiddlewareError } from './commons/middlewares/errors/csrf.middleware';
import { csrfMiddleware } from './commons/middlewares/generals/csrf.middleware';

import { webAppConfigs_should_be_object_not_undefined } from './contracts/other-errors/error-codes.json';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const { corsConfigs } = corsConfigsGenerator();
    const { helmetConfigs } = helmetConfigsGenerator();
    const configService = app.get(ConfigService);
    const appConfigs =
        configService.get<webAppConfigs>('webAppConfigs');

    if (!appConfigs) {
        throw new Error(webAppConfigs_should_be_object_not_undefined);
    }

    // initialize Swagger using the SwaggerModule class
    const documentBuilderConfig = new DocumentBuilder()
        .setTitle('Headless weblog')
        .setDescription(
            'The Headless RESTful API implemented in Prisma and NestJS',
        )
        .setVersion('1.0')
        .addTag('weblog')
        .build();
    const swaggerDocument = SwaggerModule.createDocument(
        app,
        documentBuilderConfig,
    );

    app.use(cookieParser());
    app.use(
        csurf({
            cookie: { sameSite: true },
            value: (req) => req.cookies['XSRF-TOKEN'],
        }),
    );
    app.use(csrfMiddleware);
    app.use(csrfMiddlewareError);
    app.enableCors(corsConfigs);
    app.use(helmet(helmetConfigs));
    SwaggerModule.setup(appConfigs.swaggerPath, app, swaggerDocument);

    await app.listen(appConfigs.port);
}
bootstrap();
