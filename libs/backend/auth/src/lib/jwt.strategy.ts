import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { DecodedIdToken, oauthCookieTokens } from '@shared';
import { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import {
  ExtractJwt,
  Strategy,
  WithSecretOrKeyProvider,
} from 'passport-jwt';
import { AUTH_MODULE_OPTIONS } from './auth.constants';
import { AuthModuleOptions } from './types/auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    authModuleOptions: AuthModuleOptions,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // Fetch the public keys from the jwksUri endpoint.
        jwksUri: `${authModuleOptions.fusionAuthHost}/.well-known/jwks.json`,
      }),
      jwtFromRequest,
      audience: authModuleOptions.fusionAuthApplicationId,
      issuer: authModuleOptions.fusionAuthIssuer,
      algorithms: ['RS256'],
    } as WithSecretOrKeyProvider);
  }

  validate(payload: DecodedIdToken): DecodedIdToken {
    return payload;
  }
}
export function jwtFromRequest(request: Request): string | null {
  const { accessToken } = oauthCookieTokens;

  if (request?.cookies?.[accessToken]) {
    return request.cookies[accessToken];
  }

  if (request?.headers) {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
  }

  return null;
}
