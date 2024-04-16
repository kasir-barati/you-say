import { DecodedIdToken } from '@shared';
import { decode } from 'jsonwebtoken';

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
    console.error(error);
  }
}
