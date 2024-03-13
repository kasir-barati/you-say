import { cleanupFusionAuth } from './cleanup-fusionauth.util';

export async function cleanup() {
  await cleanupFusionAuth();
}
