import { logger } from './logger.util';

type Cookie = 'id_token';

export function getCookie(cookie: Cookie) {
  const cookies = getCookies();

  return cookies.get(cookie);
}

function getCookies(): Map<string, string> {
  try {
    const cookies = document?.cookie?.split(';');
    const splittedCookies = cookies.map((cookie) =>
      cookie.split('='),
    );
    const sanitizedCookies = splittedCookies
      .map(([key, value]) => [key.trim(), value.trim()])
      .filter(([key, value]) => Boolean(key) && Boolean(value));

    return new Map(sanitizedCookies as Array<[string, string]>);
  } catch (error) {
    logger.error(error);
    return new Map();
  }
}
