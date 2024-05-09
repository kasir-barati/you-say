import { ErrorResponseDto } from '@backend/common';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { FindAllResponseDto } from './dto/find-all-response.dto';
import { PostService } from './services/post.service';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({
    summary: 'Find all posts',
    description:
      'You can filter posts based on different properties and for different pages',
  })
  @ApiOkResponse({
    type: FindAllResponseDto,
    description: 'Returns a list of post',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Bad Request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  findAll(
    @Query() queries: FindAllQueryDto,
  ): Promise<FindAllResponseDto> {
    return this.postService.findAll(queries);
  }
}
