import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@shared';
import { Type } from 'class-transformer';
import { IsNotIn, IsOptional } from 'class-validator';
import { IsInt32 } from '../decorators/is-int32.decorator';

export class PaginationQueryDto implements PaginationQuery {
  @ApiProperty({
    default: 1,
    required: false,
    description:
      'Page number, it cannot be a negative number or zero.',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt32(true)
  @IsNotIn([0])
  page = 1;

  @ApiProperty({
    default: 10,
    required: false,
    description:
      'How many documents per page, it cannot be a negative number or zero..',
    example: 3,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt32(true)
  @IsNotIn([0])
  limit = 10;
}
