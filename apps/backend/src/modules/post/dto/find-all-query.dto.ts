import { ApiProperty } from '@nestjs/swagger';
import { FindAllPostsQuery } from '@shared';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

const order = ['asc', 'desc'] as const;

export class FindAllQueryDto
  extends PaginationQueryDto
  implements FindAllPostsQuery
{
  @ApiProperty({
    enum: order,
    default: 'asc',
    example: 'asc',
    required: false,
  })
  @IsOptional()
  @IsIn(order)
  createdAt: 'asc' | 'desc' = 'asc';
}
