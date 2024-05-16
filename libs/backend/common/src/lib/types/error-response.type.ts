import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '@shared';

export class ErrorResponseDto implements ErrorResponse {
  @ApiProperty({
    description:
      '`class-validator` generates an array of strings, but everyone else throw a string as the error message.',
  })
  message: string[] | string;

  @ApiProperty({
    description: 'Where the error occurred.',
  })
  path: string;

  @ApiProperty({
    description: 'When the error occurred.',
  })
  timestamp: string;
}
