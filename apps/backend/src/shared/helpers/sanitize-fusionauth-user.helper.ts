import { FusionAuthUser } from '@shared';

export class FusionAuthUserSanitizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toUser(data: any): FusionAuthUser {
    if (!data) {
      throw '[Error-128d5b9ff79] No data provided';
    }

    return {
      email: data.email,
      fusionAuthId: data.fusionAuthId,
      lastName: data.lastName,
      firstName: data.firstName,
    };
  }
}
