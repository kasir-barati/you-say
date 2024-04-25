import { TokenType } from '@fusionauth/typescript-client';
import { ApiProperty } from '@nestjs/swagger';
import { MobileLoginResponse } from '@shared';

export class MobileLoginResponseDto implements MobileLoginResponse {
  @ApiProperty({
    description: 'JWT ID Token',
  })
  idToken: string;

  @ApiProperty({
    example: 'Bearer',
    description: 'JWT token type',
  })
  tokenType: TokenType;

  @ApiProperty({
    example: 3600,
    description: 'JWT token expiration time in seconds',
  })
  accessTokenExpiresIn: number;

  @ApiProperty({
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'Refresh token, used to exchange for new tokens. It is not a JWT token.',
  })
  refreshToken: string;
}
