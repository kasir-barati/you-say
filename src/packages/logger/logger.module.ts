import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { WinstonConfigService } from './logger.config';
import { LoggerService } from './logger.service';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            useClass: WinstonConfigService,
        }),
    ],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
