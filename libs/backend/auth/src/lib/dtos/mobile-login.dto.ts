import { ApiProperty } from '@nestjs/swagger';
import { MobileLoginRequestBody } from '@shared';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class MobileLoginDto implements MobileLoginRequestBody {
  @ApiProperty({
    example: 'exmaple@gmail.com',
    description: "User's Email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '<P@SS Word>',
    minLength: 8,
    description:
      "User's password. Find the details about password requirements in `deployment/fusionauth/main.tf` in `password_validation_rules` section.",
  })
  @Transform(({ value }) => value?.trim?.())
  @IsString()
  @MinLength(8)
  password: string;
}
