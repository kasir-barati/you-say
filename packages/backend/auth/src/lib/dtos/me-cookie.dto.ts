import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { oauthCookieTokens } from '../contracts/oauth-cookie-tokens.contract';

// We are not verifying whether it is a valid JWT token or not here since it has been taken care of in jwt.strategy.ts.
export class MeCookie {
  @ApiProperty({
    name: oauthCookieTokens.accessToken,
    description: 'JWT access token.',
  })
  @Expose({ name: oauthCookieTokens.accessToken })
  @IsNotEmpty()
  accessToken: string;
}
