import { CookieOptions, Response } from 'express';

/**
 * @description as a security best practice we are saving cookies as `httpOnly` to prevent client from reading it with JS.`.
 */
export function setSecureCookie(
  response: Response,
  name: string,
  value: string,
) {
  const secure = response.req.protocol === 'http' ? false : true;

  response.cookie(name, value, {
    secure,
    sameSite: 'lax',
    httpOnly: true,
  });
}

export function setCookie(
  response: Response,
  name: string,
  value: unknown,
  maxAge: number | undefined = undefined,
) {
  const secure = response.req.protocol === 'http' ? false : true;
  const cookieProps: CookieOptions = {
    secure,
    sameSite: 'lax',
    httpOnly: false,
  };

  if (maxAge) {
    cookieProps.maxAge = maxAge;
  }

  response.cookie(name, value, cookieProps);
}
