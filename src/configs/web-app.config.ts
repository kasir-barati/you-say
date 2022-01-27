import { registerAs } from '@nestjs/config';
import { NodeEnv, webAppConfigs } from '../shared/types/web.type';

export default registerAs(
    'webAppConfigs',
    (): webAppConfigs => ({
        nodeEnv:
            (process.env?.NODE_ENV as NodeEnv) ?? NodeEnv.development,
        sa: {
            username: process.env?.SA_USERNAME,
            password: process.env?.SA_PASSWORD,
        },
        host: process.env?.APP_HOST ?? 'localhost',
        port: Number(process.env?.APP_PORT) ?? 3000,
        exposedPort: Number(process.env?.APP_EXPOSED_PORT) ?? 5000,
        baseUrl: process.env.BASE_URL,
        swaggerPath: process.env?.SWAGGER_PATH ?? 'docs',
    }),
);
