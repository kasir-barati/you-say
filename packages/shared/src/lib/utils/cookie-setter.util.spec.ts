import { Response } from 'express';
import { SinonMock } from '../test-utils/sinon-mock.helper';
import { MockedEntityWithSinonStubs } from '../types/mock.type';
import { setCookie, setSecureCookie } from './cookie-setter.util';

describe('setSecureCookie', () => {
  let mockResponse: MockedEntityWithSinonStubs<Response>;

  beforeEach(() => {
    mockResponse = SinonMock.with<Response>({
      cookie: jest.fn(),
      req: {
        protocol: 'https',
      },
    });
  });

  it.each<{ name: string; value: string }>([
    { name: 'testCookie', value: 'testValue' },
    { name: 'favoriteFood', value: 'iLoveCookies' },
  ])(
    'should set secure cookie with httpOnly flag %o',
    ({ name, value }) => {
      setSecureCookie(mockResponse, name, value);

      expect(mockResponse.cookie).toHaveBeenCalledWith(name, value, {
        secure: true,
        sameSite: 'lax',
        httpOnly: true,
      });
    },
  );

  it('should set secure to false when protocol is http', () => {
    mockResponse.req.protocol = 'http';

    setSecureCookie(mockResponse, 'testCookie', 'testValue');

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'testCookie',
      'testValue',
      {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
      },
    );
  });
});

describe('setCookie', () => {
  let mockResponse: MockedEntityWithSinonStubs<Response>;

  beforeEach(() => {
    mockResponse = SinonMock.with<Response>({
      cookie: jest.fn(),
      req: {
        protocol: 'https',
      },
    });
  });

  it.each<{ name: string; value: string; maxAge: number }>([
    {
      name: 'Schokoladenkekse',
      value: 'chocolateCookie',
      maxAge: 3600,
    },
    { name: 'VanilleKekse', value: 'vanillaCookie', maxAge: 1300 },
  ])(
    'should set %o as cookie with specified options',
    ({ name, value, maxAge }) => {
      setCookie(mockResponse, name, value, maxAge);

      expect(mockResponse.cookie).toHaveBeenCalledWith(name, value, {
        secure: true,
        sameSite: 'lax',
        httpOnly: false,
        maxAge,
      });
    },
  );

  it('should set cookie without maxAge if not specified', () => {
    setCookie(mockResponse, 'Käsekekse', 'cheeseCookie');

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'Käsekekse',
      'cheeseCookie',
      {
        secure: true,
        sameSite: 'lax',
        httpOnly: false,
      },
    );
  });

  it('should set unsecure cookie when protocol is http', () => {
    mockResponse.req.protocol = 'http';

    setCookie(mockResponse, 'KirschKekse', 'cherryCookie');

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'KirschKekse',
      'cherryCookie',
      {
        secure: false,
        sameSite: 'lax',
        httpOnly: false,
      },
    );
  });
});
