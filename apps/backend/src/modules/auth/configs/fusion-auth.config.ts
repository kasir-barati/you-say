import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import { validateEnvs } from '../../../shared/helpers/validate-envs.helper';
import { FusionAuthClientConfig } from '../auth.type';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends FusionAuthClientConfig {}
  }
}

export default registerAs(
  'fusionAuthConfigs',
  (): FusionAuthClientConfig => {
    const validatedEnvs = validateEnvs(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements FusionAuthClientConfig {
  @IsOptional()
  @IsString()
  FUSIONAUTH_HOST = 'http://fusionauth:9011';

  @IsOptional()
  @IsString()
  FUSIONAUTH_ISSUER = 'http://fusionauth:9011';

  // TODO: Should I remove client id and use application id only since based on what I understood from terraform basically they are the same thing
  @IsOptional()
  @IsString()
  FUSIONAUTH_CLIENT_ID = 'b94471aa-bc85-4538-b1a8-e3c4642c9c8b';

  @IsOptional()
  @IsString()
  FUSIONAUTH_APPLICATION_ID = 'b94471aa-bc85-4538-b1a8-e3c4642c9c8b';

  @IsOptional()
  @IsString()
  FUSIONAUTH_ADMIN_GROUP_ID = '66d8f123-06f3-4fa6-a236-3fb755ffd4d9';

  @IsOptional()
  @IsString()
  FUSIONAUTH_API_KEY =
    'bd39d2fa6bd148ac3be8a919c5d421b79ddaa338cf227368018b9bf65ef6ded3751e4f3b90bf4dc19127b019aa26af14dfaabc88f6e3ae439b70b0d4f71c9c9d';

  @IsOptional()
  @IsString()
  FUSIONAUTH_TENANT_ID = '40b82d21-2343-40e3-bae0-20b63210bd96';
}
