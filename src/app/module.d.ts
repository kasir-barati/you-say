namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV?: string;
        DATABASE_URL: string;
        APP_PORT: string;
        APP_EXPOSED_PORT: string;
        APP_HOST: string;
        SWAGGER_PATH?: string;
    }
}
