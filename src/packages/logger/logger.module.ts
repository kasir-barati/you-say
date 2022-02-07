import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import loggerConfig from './logger.config';
import { validate } from './validators/env.validator';
import { LoggerService } from './logger.service';

@Module({
    // config factory
    imports: [
        ConfigModule.forFeature({
            envFilePath: ['.env'],
            load: [loggerConfig],
            cache: true,
            validate,
        }),
    ],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
