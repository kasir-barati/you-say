import { ApiProperty } from '@nestjs/swagger';
import { oauthCookieTokens } from '@shared';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshCookieDto {
  @ApiProperty({
    name: oauthCookieTokens.refreshToken,
    description:
      'The refresh token that you would like to use to exchange for an access token.',
  })
  @Expose({ name: oauthCookieTokens.refreshToken })
  @Transform(({ value }) => value?.trim?.())
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
