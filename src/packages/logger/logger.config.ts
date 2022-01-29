import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
    WinstonModuleOptions,
    WinstonModuleOptionsFactory,
} from 'nest-winston';

import winstonConfig from './winston.config';

@Injectable()
export class WinstonConfigService
    implements WinstonModuleOptionsFactory
{
    constructor(
        @Inject(winstonConfig.KEY)
        private readonly winstonConfigs: ConfigType<
            typeof winstonConfig
        >,
    ) {}
    createWinstonModuleOptions(): WinstonModuleOptions {
        return this.winstonConfigs;
    }
}
