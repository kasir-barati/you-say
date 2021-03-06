import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly loggerService: LoggerService) {}

    create(createPostDto: CreatePostDto) {
        createPostDto;
        this.loggerService.info('Hello winston');
        return 'This action adds a new post';
    }

    findAll() {
        return `This action returns all posts`;
    }

    findOne(id: string) {
        return `This action returns a #${id} post`;
    }

    update(id: string, updatePostDto: UpdatePostDto) {
        updatePostDto;
        return `This action updates a #${id} post`;
    }

    remove(id: string) {
        return `This action removes a #${id} post`;
    }
}
