import { IsValidString } from '@backend/common';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfoDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'First name',
  })
  @IsValidString({ minLength: 1, maxLength: 255 })
  firstName?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Last name',
  })
  @IsValidString({ minLength: 1, maxLength: 255 })
  lastName?: string;
}
