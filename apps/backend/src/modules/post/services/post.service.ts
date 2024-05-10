import { LoggerService } from '@backend/logger';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from '../../../shared/helpers/paginate.helper';
import { seedPostsCollection } from '../../../shared/helpers/seed-posts-collection.helper';
import { FindAllQueryDto } from '../dto/find-all-query.dto';
import { FindAllResponseDto } from '../dto/find-all-response.dto';
import { Post } from '../entities/post.entity';
import { PostSanitizer } from './post-sanitizer.service';

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    private readonly postSanitizer: PostSanitizer,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly loggerService: LoggerService,
  ) {}

  async onModuleInit() {
    this.loggerService.setContext(PostService.name);
    this.loggerService.log('Seeding posts collection');
    await seedPostsCollection(this.postModel);
  }

  async findAll(
    queries: FindAllQueryDto,
  ): Promise<FindAllResponseDto> {
    const { limit, page, createdAt } = queries;
    const skip = (page - 1) * limit;
    const { items, pages } = await paginate({
      model: this.postModel,
      limit,
      filter: {},
    });
    const data = await this.postModel
      .find({}, {}, { limit, skip })
      .sort({ createdAt });

    return {
      data: data.map((post) => this.postSanitizer.toPost(post)),
      page,
      limit,
      items,
      pages,
    };
  }
}
