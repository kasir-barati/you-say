import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsValidString } from '../../../shared/decorators/is-valid-string.decorator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: "User's Email address",
    example: `e${Date.now()}@gmail.com`,
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
}
