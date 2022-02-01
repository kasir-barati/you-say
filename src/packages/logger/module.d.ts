namespace NodeJS {
    interface ProcessEnv {
        LOGGER_LEVEL: WinstonDefaultLogLevels;
        LOGGER_MAX_SIZE: string;
        LOGGER_MAX_FILES: string;
        IS_ROTATE_LOGGER_FILES_ACTIVATED: boolean;
        LOGGER_NAME?: string;
    }
}
