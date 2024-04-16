import { ApiProperty } from '@nestjs/swagger';
import { OauthCallbackRequestQuery } from '@shared';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class OauthCallbackQuery implements OauthCallbackRequestQuery {
  @ApiProperty({
    description:
      "This is the authorization code that the OAuth server created after the user was logged in. We'll exchange this code for tokens.",
  })
  @Transform(({ value }) => trimAndSanitize(value))
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description:
      'This is the same value of the state parameter we passed to the OAuth server. This is echoed back to the application so that the application can verify that the code came from the correct location.',
  })
  @Transform(({ value }) => trimAndSanitize(value))
  @IsNotEmpty()
  @IsString()
  state: string;
}

// Maybe can be a shared decorator if we need it somewhere else too
function trimAndSanitize(value: unknown): string {
  const sanitizedValue = Array.isArray(value) ? value[0] : value;

  return sanitizedValue?.trim?.();
}
