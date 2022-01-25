import { NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { ConsoleLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

// All general configs for RESTful API
import corsConfig from './configs/cors.config';
import helmetConfig from './configs/helmet.config';
import winstonConfig from './configs/winston.config';
import webAppConfig from './configs/web-app.config';

// All Middleware
import { csrfMiddlewareError } from './shared/middlewares/errors/csrf.middleware';
import { csrfMiddleware } from './shared/middlewares/generals/csrf.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    const webAppConfigs = app.get<ConfigType<typeof webAppConfig>>(
        webAppConfig.KEY,
    );
    const corsConfigs = app.get<ConfigType<typeof corsConfig>>(
        corsConfig.KEY,
    );
    const helmetConfigs = app.get<ConfigType<typeof helmetConfig>>(
        helmetConfig.KEY,
    );
    const winstonConfigs = app.get<ConfigType<typeof winstonConfig>>(
        winstonConfig.KEY,
    );
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

    app.useLogger(app.get(ConsoleLogger));
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
    SwaggerModule.setup(
        webAppConfigs.swaggerPath,
        app,
        swaggerDocument,
    );

    await app.listen(webAppConfigs.port);
}
bootstrap();
