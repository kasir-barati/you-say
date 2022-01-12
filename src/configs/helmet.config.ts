import { HelmetOptions } from 'helmet';

export function helmetConfigsGenerator(): {
    helmetConfigs: HelmetOptions;
} {
    const helmetConfigs: HelmetOptions = {
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        dnsPrefetchControl: true,
        expectCt: true,
        frameguard: true,
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        originAgentCluster: true,
        permittedCrossDomainPolicies: true,
        referrerPolicy: true,
        xssFilter: true,
    };

    return { helmetConfigs };
}
