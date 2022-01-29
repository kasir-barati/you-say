import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import webAppConfig from '../configs/web-app.config';
import winstonConfig from '../packages/logger/winston.config';
import corsConfig from '../configs/cors.config';
import helmetConfig from '../configs/helmet.config';
import { PostsModule } from '../packages/posts/posts.module';
import { UsersModule } from '../packages/users/users.module';
import { validate } from '../shared/validators/env.validator';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [
                webAppConfig,
                winstonConfig,
                corsConfig,
                helmetConfig,
            ],
            cache: true,
            validate,
        }),
        PostsModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
