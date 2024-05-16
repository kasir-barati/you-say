import { ApiProperty } from '@nestjs/swagger';
import { oauthCookieTokens } from '@shared';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

// We are not verifying whether it is a valid JWT token or not here since it has been taken care of in jwt.strategy.ts.
export class MeCookieDto {
  @ApiProperty({
    name: oauthCookieTokens.accessToken,
    description: 'JWT access token.',
  })
  @Expose({ name: oauthCookieTokens.accessToken })
  @IsNotEmpty()
  accessToken: string;
}
