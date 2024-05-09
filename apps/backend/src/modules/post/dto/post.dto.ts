import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@shared';
import { FusionAuthUserDto } from '../../../shared/dto/fusionauth-user.dto';

export class PostDto implements Post {
  @ApiProperty({
    description: 'Post ID',
    example: '624616797870316ac1432d52',
  })
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'Post title',
  })
  title: string;

  @ApiProperty({
    description: 'Post content in markdown',
    example: '# Post content',
  })
  content: string;

  @ApiProperty({
    description: 'Post image',
    example: 'https://you-say.com/images/post-image.png', // TODO: Add real image url
  })
  postImage: string;

  @ApiProperty({
    description: 'Post description',
    example: 'Post description',
  })
  description: string;

  @ApiProperty({
    description: 'FusionAuth User info',
    type: FusionAuthUserDto,
  })
  fusionAuthUser: FusionAuthUserDto;

  @ApiProperty({
    description: 'Post created at',
    example: new Date().toString(),
  })
  createdAt: string;

  @ApiProperty({
    description: 'Post updated at',
    example: new Date().toString(),
  })
  updatedAt: string;
}
