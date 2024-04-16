import { NodeEnv } from '@shared';

export interface AppConfig {
  APP_PORT: number;
  APP_HOST: string;
  APP_BASE_URL: string;
  NODE_ENV: NodeEnv;
  SWAGGER_PATH: string;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
  FUSIONAUTH_API_KEY: string;
  FUSIONAUTH_HOST: string;
  FUSIONAUTH_TENANT_ID: string;
  FUSIONAUTH_APPLICATION_ID: string;
  FUSIONAUTH_ADMIN_GROUP_ID: string;
  FUSIONAUTH_ISSUER: string;
  FUSIONAUTH_CLIENT_ID: string;
  FUSIONAUTH_OAUTH_SCOPES: string;
  FRONTEND_URL: string;
  DOMAIN_OF_COOKIE: string;
  OAUTH_CONFIGURATION_CLIENT_SECRET: string;
}
