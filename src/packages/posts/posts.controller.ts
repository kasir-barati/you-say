import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @HttpCode(201)
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get()
    @HttpCode(200)
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':postId')
    @HttpCode(200)
    findOne(@Param('postId') postId: string) {
        return this.postsService.findOne(postId);
    }

    @Patch(':postId')
    @HttpCode(200)
    update(
        @Param('postId') postId: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postsService.update(postId, updatePostDto);
    }

    @Delete(':postId')
    @HttpCode(202)
    remove(@Param('postId') postId: string) {
        return this.postsService.remove(postId);
    }
}
