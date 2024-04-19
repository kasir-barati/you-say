import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class OauthCallbackCookie {
  @ApiProperty({
    example: 'wuruazmrvvteawaflktmzxyw_gwmt-yz',
    description:
      'This is also what we generated and attached it to the response cookies in login endpoint.',
  })
  @Transform(({ value }) => value?.trim?.())
  @IsNotEmpty()
  @IsString()
  codeVerifier: string;
}
