import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import {
  ExtractJwt,
  Strategy,
  WithSecretOrKeyProvider,
} from 'passport-jwt';
import fusionAuthConfig from './configs/fusion-auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(fusionAuthConfig.KEY)
    fusionAuthConfigs: ConfigType<typeof fusionAuthConfig>,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${fusionAuthConfigs.FUSIONAUTH_HOST}/.well-known/jwks.json`,
      }),
      jwtFromRequest,
      audience: fusionAuthConfigs.FUSIONAUTH_CLIENT_ID,
      issuer: fusionAuthConfigs.FUSIONAUTH_ISSUER,
      algorithms: ['RS256'],
    } as WithSecretOrKeyProvider);
  }

  validate(payload: Request['user']): Request['user'] {
    return payload;
  }
}
export function jwtFromRequest(request: Request): string | null {
  if (request?.cookies?.accessToken) {
    return request.cookies.accessToken;
  }

  if (request?.headers) {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
  }

  return null;
}
