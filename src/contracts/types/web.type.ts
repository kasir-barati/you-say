export enum NodeEnv {
    development = 'development',
    production = 'production',
    test = 'test',
    provision = 'provision',
}

export interface webAppConfigs {
    nodeEnv: NodeEnv;
    sa: {
        username?: string;
        password?: string;
    };
    host: string;
    port: number;
    exposedPort: number;
    swaggerPath: string;
}
