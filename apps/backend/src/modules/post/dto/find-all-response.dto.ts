import { ApiProperty } from '@nestjs/swagger';
import { FindAllPostsResponse, Post } from '@shared';
import { PaginationResponseDto } from '../../../shared/dto/pagination-response.dto';
import { PostDto } from './post.dto';

export class FindAllResponseDto
  extends PaginationResponseDto<Post>
  implements FindAllPostsResponse
{
  @ApiProperty({
    type: [PostDto],
  })
  data: Post[];
}
