import { registerAs } from '@nestjs/config';
import { HelmetOptions } from 'helmet';

export default registerAs(
  'helmetConfigs',
  (): HelmetOptions => ({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    // expectCt: true, FIXME: DEPRECATED?
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
  }),
);
