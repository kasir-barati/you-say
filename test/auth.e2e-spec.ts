import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

// import { AppModule } from '@you-say/src/app/app.module';
import { JwtToken } from '../src/packages/auth/types/jwt-token.type';
import { LoginUserRequestDto } from '@you-say/src/packages/auth/dto';
import { ConfigModule } from '@nestjs/config';
import webAppConfig from '@you-say/src/app/configs/web-app.config';
import corsConfig from '@you-say/src/app/configs/cors.config';
import helmetConfig from '@you-say/src/app/configs/helmet.config';
import { PostsModule } from '@you-say/src/packages/posts/posts.module';
import { UsersModule } from '@you-say/src/packages/users/users.module';
import { LoggerModule } from '@you-say/src/packages/logger/logger.module';
import { validate } from '@you-say/src/shared/validators/env.validator';
import { AppController } from '@you-say/src/app/app.controller';
import { PrismaService } from '@you-say/src/prisma/prisma.service';
import { AppService } from '@you-say/src/app/app.service';

const baseUrl = '/api/v1';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule =
            await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: ['.env'],
                        load: [
                            webAppConfig,
                            corsConfig,
                            helmetConfig,
                        ],
                        cache: true,
                        validate,
                    }),
                    PostsModule,
                    UsersModule,
                    LoggerModule,
                ],
                controllers: [AppController],
                providers: [AppService, PrismaService],
            }).compile();
        // No Deference
        // await Test.createTestingModule({
        //     imports: [AppModule]
        // }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/login (POST)', async () => {
        const loginDto: LoginUserRequestDto = {
            password: '',
            username: '',
        };
        const loginResponse = await request(app.getHttpServer())
            .post(`${baseUrl}/auth/login`)
            .send(loginDto)
            .expect(200);
        const userAccessToken = (loginResponse?.body as JwtToken)
            ?.accessToken;
        const userRefreshToken = (loginResponse?.body as JwtToken)
            ?.refreshToken;

        expect(userAccessToken).toBeDefined();
        expect(userRefreshToken).toBeDefined();
    });
});
