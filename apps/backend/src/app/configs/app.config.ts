import { registerAs } from '@nestjs/config';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { validateEnvs } from '../../shared/helpers/validate-envs.helper';
import { NodeEnv } from '../../shared/types/node-env';
import { AppConfig } from '../app.type';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends AppConfig {}
  }
}

export default registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnvs(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsOptional()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsOptional()
  @IsString()
  SWAGGER_PATH = 'docs';

  @IsString()
  DATABASE_URL: string;

  @IsString()
  MONGO_INITDB_DATABASE: string;
}
