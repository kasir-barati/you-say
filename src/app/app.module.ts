import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import webAppConfig from '../configs/web-app.config';
import winstonConfig from '../configs/winston.config';
import { PostsModule } from '../packages/posts/posts.module';
import { UsersModule } from '../packages/users/users.module';
import { validate } from '../shared/validators/env.validator';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [webAppConfig, winstonConfig],
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
