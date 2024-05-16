import { IsValidString } from '@backend/common';
import { ApiProperty } from '@nestjs/swagger';
import { MobileRegisterRequestBody } from '@shared';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class MobileRegisterDto implements MobileRegisterRequestBody {
  @ApiProperty({
    type: String,
    description: "User's Email address",
    example: 'some.random.email@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: "User's first name",
  })
  @IsValidString()
  firstName: string;

  @ApiProperty({
    type: String,
    description: "User's last name",
  })
  @IsValidString()
  lastName: string;

  @ApiProperty({
    type: String,
    minLength: 8,
    description:
      "User's password. Please do not allow user to use white space at the end or beginning of their password(we will trim it!). note that spaces inside password are fine (find specificities about password requirements in `deployment/fusionauth/main.tf` in `password_validation_rules` section). One more thing, since data will be sent over HTTPS there will be no issue with password being sent in plain text.",
  })
  @Transform(({ value }) => value?.trim?.())
  @IsString()
  @MinLength(8)
  password: string;
}
