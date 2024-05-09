import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '@shared';

export class PaginationResponseDto<T>
  implements PaginationResponse<T>
{
  @ApiProperty({
    description: 'Paginated Data',
    type: [Object],
  })
  data: T[];

  @ApiProperty({
    description: 'Current page',
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  pages: number;

  @ApiProperty({
    description: 'Number of row to be returned',
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
  })
  items: number;
}
