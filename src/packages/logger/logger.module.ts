import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import loggerConfig from './logger.config';
import { LoggerService } from './logger.service';

@Module({
    imports: [ConfigModule.forFeature(loggerConfig)],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
