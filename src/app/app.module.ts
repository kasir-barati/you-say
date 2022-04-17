import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import webAppConfig from './configs/web-app.config';
import corsConfig from './configs/cors.config';
import helmetConfig from './configs/helmet.config';
import { PostsModule } from '../packages/posts/posts.module';
import { UsersModule } from '../packages/users/users.module';
import { LoggerModule } from '../packages/logger/logger.module';
import { validate } from '../shared/validators/env.validator';
import { AuthModule } from '../packages/auth/auth.module';
import { AuthController } from '../packages/auth/auth.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            load: [webAppConfig, corsConfig, helmetConfig],
            cache: true,
            validate,
        }),
        PostsModule,
        AuthModule,
        UsersModule,
        LoggerModule,
    ],
    controllers: [AppController, AuthController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
