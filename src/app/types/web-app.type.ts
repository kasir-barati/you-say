import { NodeEnv } from '@you-say/src/shared/types/web.type';

export interface webAppConfigs {
    nodeEnv: NodeEnv;
    sa: {
        username?: string;
        password?: string;
    };
    host: string;
    port: number;
    baseUrl?: string;
    exposedPort: number;
    swaggerPath: string;
}
