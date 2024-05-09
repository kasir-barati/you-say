import { DecodedIdToken } from '@shared';
import { decode } from 'jsonwebtoken';
import { logger } from './logger.util';

export function getDecodedIdToken(
  idToken: string,
): DecodedIdToken | undefined {
  try {
    const decodedIdToken = decode(idToken) as DecodedIdToken;

    if (
      !decodedIdToken?.roles ||
      !decodedIdToken?.roles?.every(
        (role) => typeof role === 'string',
      )
    ) {
      decodedIdToken.roles = null;
    }

    return decodedIdToken;
  } catch (error) {
    logger.error(error);
  }
}
