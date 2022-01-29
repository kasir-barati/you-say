import { NodeEnv } from './src/shared/types/web.type';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: NodeEnv;
            DATABASE_URL: string;
            APP_PORT: string;
            APP_EXPOSED_PORT: string;
            APP_HOST: string;
            SA_USERNAME?: string;
            SA_PASSWORD?: string;
            SWAGGER_PATH?: string;
        }
    }
}
