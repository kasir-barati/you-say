import { NodeEnv } from '../shared/types/node-env';

export interface AppConfig {
  NODE_ENV: NodeEnv;
  SWAGGER_PATH: string;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
}
