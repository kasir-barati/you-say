import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import webAppConfig from '@you-say/src/configs/web-app.config';
import { NodeEnv } from '@you-say/src/shared/types/web.type';

interface ErrorParams {
    name: string;
    stack?: any;
    context?: string;
    // TODO: define extra type due to the different services
    meta?: { message?: string; extra: any };
}

interface WarnParams {
    name: string;
    context?: string;
    meta: { message?: string; extra: any };
}

interface DebugParams {
    message: string;
    context?: string;
    extra?: any;
}

interface VerboseParams {
    anything: any;
}

// TODO: Implement your custom logger params
@Injectable()
export class LoggerService extends ConsoleLogger {
    constructor(
        @Inject(webAppConfig.KEY)
        private webAppConfigs: ConfigType<typeof webAppConfig>,
    ) {
        super();
        this.setLogLevels(
            this.webAppConfigs.nodeEnv === NodeEnv.production
                ? ['log', 'warn', 'error']
                : ['error', 'warn', 'log', 'verbose', 'debug'],
        );
    }

    /**
     * Write a 'log' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: [...any, string?]): void;
    log(message: any, contextOrOptionalParams?: string): void {
        if (typeof contextOrOptionalParams === 'string') {
            super.log(message, contextOrOptionalParams);
        } else {
            super.log(message, contextOrOptionalParams);
        }
    }

    /**
     * Write an 'error' level log, if the configured level allows for it.
     * Prints to `stderr` with newline.
     */
    error(params: ErrorParams): void;
    error({ name, stack, context, meta }: ErrorParams): void {
        super.error(name, [stack, context, meta]);
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
            super.warn(messageOrParams, optionalParams);
        } else {
            const { name, meta, context } = messageOrParams;
            super.warn(name, [context, meta]);
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
            super.warn(messageOrParams, context);
        } else {
            const { context, message, extra } = messageOrParams;
            super.warn(message, [context, extra]);
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
            super.verbose(messageOrVerboseParams, context);
        } else {
            super.verbose(messageOrVerboseParams);
        }
    }
    /**
     * Set log levels
     * @param levels log levels
     */
}
