import { Inject, Injectable, Logger } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';
import { ConfigType } from '@nestjs/config';

import {
    DebugParams,
    ErrorParams,
    VerboseParams,
    WarnParams,
} from './logger.type';
import loggerConfig from './logger.config';
import { winstonTransports } from './winston.transport';

@Injectable()
export class LoggerService extends Logger {
    private winstonLogger: WinstonLogger;

    constructor(
        @Inject(loggerConfig.KEY)
        private readonly loggerConfigs: ConfigType<
            typeof loggerConfig
        >,
    ) {
        super();
        // https://github.com/slaypotato/logger-nestjs/blob/fb0eb7f6f2b844679ad9e38145e54228a53fe120/src/logger.service.ts
        // https://github.com/KingsBD/Nestjs-base-projects/tree/2f08e4fd6f7486e297160ab381ba2a0dc492af92/nestjs-base-project-type-orm/src/logger
        // https://github.com/GabeStah/stripe-intuit-connector/tree/b25443c4d98071c4a78878e890131979891b6ec0/src/log
        // https://github.com/edgar-durand/gateways/blob/6da114a199c3fd218f504c95146f5403c08d0a8e/src/logger/logger.module.ts
        // https://wanago.io/2021/10/04/api-nestjs-logging-typeorm/
        // webAppConfigs.nodeEnv === NodeEnv.production
        //     ? 'warn'
        //     : 'silly',
        const winstonTransporters = winstonTransports(
            this.loggerConfigs,
        );

        this.winstonLogger = createLogger(winstonTransporters);
    }

    /**
     * Write a 'log' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    info(message: any, context: string): void;
    info(message: any, ...optionalParams: [...any, string?]): void;
    info(message: any, contextOrOptionalParams?: string): void {
        if (typeof contextOrOptionalParams === 'string') {
            this.winstonLogger.info(message, contextOrOptionalParams);
        } else {
            this.winstonLogger.info(message, contextOrOptionalParams);
        }
    }

    /**
     * Write an 'error' level log, if the configured level allows for it.
     * Prints to `stderr` with newline.
     */
    error(params: ErrorParams): void;
    error({ name, stack, context, meta }: ErrorParams): void {
        this.winstonLogger.error(name, [stack, context, meta]);
    }

    /**
     * Write a 'warn' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    warn(params: WarnParams): void;
    warn(
        messageOrParams: string | WarnParams,
        ...optionalParams: [...any, string?]
    ): void;
    warn(
        messageOrParams: string | WarnParams,
        ...optionalParams: [...any, string?]
    ): void {
        if (typeof messageOrParams === 'string') {
            this.winstonLogger.warn(messageOrParams, optionalParams);
        } else {
            const { name, meta, context } = messageOrParams;
            this.winstonLogger.warn(name, [context, meta]);
        }
    }

    /**
     * Write a 'debug' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    debug(params: DebugParams): void;
    debug(
        messageOrParams: string | DebugParams,
        context?: string,
    ): void;
    debug(messageOrParams: DebugParams, context?: string) {
        if (typeof messageOrParams === 'string') {
            this.winstonLogger.debug(messageOrParams, context);
        } else {
            const { context, message, extra } = messageOrParams;
            this.winstonLogger.debug(message, [context, extra]);
        }
    }

    /**
     * Write a 'verbose' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    verbose(message: string, context?: string): void;
    verbose(messageOrVerboseParams: VerboseParams | string): void;
    verbose(
        messageOrVerboseParams: VerboseParams | string,
        context?: string,
    ): void {
        if (typeof messageOrVerboseParams === 'string') {
            this.winstonLogger.verbose(
                messageOrVerboseParams,
                context,
            );
        } else {
            this.winstonLogger.verbose(messageOrVerboseParams);
        }
    }
    /**
     * Set log levels
     * @param levels log levels
     */
}
