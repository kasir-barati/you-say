export interface ErrorParams {
    name: string;
    stack?: any;
    context?: string;
    // TODO: define extra type due to the different services
    meta?: { message?: string; extra: any };
}

export interface WarnParams {
    name: string;
    context?: string;
    meta: { message?: string; extra: any };
}

export interface DebugParams {
    message: string;
    context?: string;
    extra?: any;
}

export interface VerboseParams {
    anything: any;
}

export interface LoggerConfig {
    level: WinstonDefaultLogLevels;
    isRotateLoggerFilesActivated: boolean;
    loggerName: string;
    loggerMaxSize: string;
    loggerMaxFile: string;
}

export enum WinstonDefaultLogLevels {
    error = 'error',
    warn = 'warn',
    info = 'info',
    verbose = 'verbose',
    debug = 'debug',
    silly = 'silly',
}
