import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

// We are not verifying whether it is a valid JWT token or not here since it has been taken care of in jwt.strategy.ts.
export class MeCookie {
  @ApiProperty({
    name: 'app.at',
    description: 'JWT access token.',
  })
  @Expose({ name: 'app.at' })
  @IsNotEmpty()
  accessToken: string;
}
