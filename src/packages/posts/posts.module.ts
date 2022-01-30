import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [LoggerModule],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
