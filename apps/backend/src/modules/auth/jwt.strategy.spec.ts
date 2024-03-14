import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { FusionAuthClientConfig, Role } from './auth.type';
import fusionAuthConfig from './configs/fusion-auth.config';
import { JwtStrategy, jwtFromRequest } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: fusionAuthConfig.KEY,
          useValue: {
            FUSIONAUTH_ADMIN_GROUP_ID: 'uuid',
            FUSIONAUTH_API_KEY: 'long-hexadecimal-key',
            FUSIONAUTH_APPLICATION_ID: 'uuid',
            FUSIONAUTH_CLIENT_ID: 'uuid',
            FUSIONAUTH_HOST: 'http://fusionauth:9011',
            FUSIONAUTH_ISSUER: 'https://you-say.com',
            FUSIONAUTH_TENANT_ID: 'uuid',
          } as FusionAuthClientConfig,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it.each<Request['user']>([
    { roles: [], sub: 'user1-uuid' },
    { roles: [Role.FileUploader], sub: 'user2-uuid' },
  ])('should be able to return the payload', (payload) => {
    const validatedPayload = strategy.validate(payload);

    expect(validatedPayload).toEqual(payload);
  });
});
describe('jwtFromRequest', () => {
  it.each<string>(['accessToken1', 'accessToken2'])(
    'should return the accessToken from the cookie',
    (accessToken) => {
      const req = {
        cookies: { accessToken },
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
