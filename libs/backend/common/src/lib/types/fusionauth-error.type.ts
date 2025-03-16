import { Errors } from '@fusionauth/typescript-client';

export interface FusionAuthErrorResponse {
  statusCode: number;
  exception: Errors;
}
