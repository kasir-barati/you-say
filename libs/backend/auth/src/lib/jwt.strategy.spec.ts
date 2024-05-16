import { Test, TestingModule } from '@nestjs/testing';
import { DecodedIdToken, Role, oauthCookieTokens } from '@shared';
import { Request } from 'express';
import { AUTH_MODULE_OPTIONS } from './auth.constants';
import { JwtStrategy, jwtFromRequest } from './jwt.strategy';
import { AuthModuleOptions } from './types/auth.type';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: {
            fusionAuthApplicationId: 'uuid',
            fusionAuthAdminGroupId: 'uuid',
            fusionAuthHost: 'http://fusionauth:9011',
            fusionAuthApiKey: 'long-hexadecimal-key',
            fusionAuthIssuer: 'https://you-say.com',
            fusionAuthTenantId: 'uuid',
          } as AuthModuleOptions,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it.each<Partial<DecodedIdToken>>([
    { roles: [], sub: 'user1-uuid' },
    { roles: [Role.FileUploader], sub: 'user2-uuid' },
  ])('should be able to return the payload', (payload) => {
    const validatedPayload = strategy.validate(
      payload as DecodedIdToken,
    );

    expect(validatedPayload).toEqual(payload);
  });
});
describe('jwtFromRequest', () => {
  it.each<string>(['accessToken1', 'accessToken2'])(
    'should return the accessToken from the cookie',
    (accessToken) => {
      const req = {
        cookies: { [oauthCookieTokens.accessToken]: accessToken },
      } as Request;

      const accessTokenFromReq = jwtFromRequest(req);

      expect(accessTokenFromReq).toEqual(accessToken);
    },
  );

  it.each<string>(['accessToken3', 'accessToken4'])(
    'should return accessToken extracted from headers',
    (accessToken) => {
      const req = {
        headers: { authorization: `Bearer ${accessToken}` },
      } as Request;

      const accessTokenFromReq = jwtFromRequest(req);

      expect(accessTokenFromReq).toEqual(accessToken);
    },
  );

  it.each([
    { cookies: {} },
    { headers: {} },
    { headers: {}, cookies: {} },
  ])('should return null', (req) => {
    const accessTokenFromReq = jwtFromRequest(req as Request);

    expect(accessTokenFromReq).toBeNull();
  });
});
