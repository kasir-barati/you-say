import { LoggerService } from '@backend/logger';
import { SinonMock, SinonMockType } from '@shared';
import { Model } from 'mongoose';
import { Post } from '../entities/post.entity';
import { PostSanitizer } from './post-sanitizer.service';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postSanitizer: SinonMockType<PostSanitizer>;
  let postModel: SinonMockType<Model<Post>>;
  let loggerService: SinonMockType<LoggerService>;
  const mockedSeedPostsCollection = jest.fn();
  const mockedPaginate = jest.fn();

  beforeEach(async () => {
    jest
      .spyOn(
        await import(
          '../../../shared/helpers/seed-posts-collection.helper'
        ),
        'seedPostsCollection',
      )
      .mockImplementation(mockedSeedPostsCollection);
    jest
      .spyOn(
        await import('../../../shared/helpers/paginate.helper'),
        'paginate',
      )
      .mockImplementation(mockedPaginate);

    postSanitizer = SinonMock.of(PostSanitizer);
    postModel = SinonMock.of(Model<Post>);
    loggerService = SinonMock.of(LoggerService);
    service = new PostService(
      postSanitizer,
      postModel,
      loggerService,
    );
  });

  it('should set context and seed on init', async () => {
    await service.onModuleInit();

    expect(
      loggerService.setContext.calledWith(PostService.name),
    ).toBe(true);
    expect(mockedSeedPostsCollection).toHaveBeenCalledTimes(1);
  });

  describe('findAll', () => {
    it('should find all posts', async () => {
      mockedPaginate.mockReturnValue({ pages: 1, items: 1 });
      postModel.find.returns({
        sort: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll({
        createdAt: 'asc',
        limit: 1,
        page: 1,
      });

      expect(result).toStrictEqual({
        data: [],
        page: 1,
        limit: 1,
        items: 1,
        pages: 1,
      });
    });

    it('should propagate errors occurred in paginate', async () => {
      mockedPaginate.mockRejectedValue(new Error());

      const result = service.findAll({
        createdAt: 'asc',
        limit: 1,
        page: 1,
      });

      expect(result).rejects.toThrow(new Error());
    });

    it('should propagate errors occurred in mongoose model', async () => {
      mockedPaginate.mockReturnValue({ pages: 1, items: 1 });
      postModel.find.returns({
        sort: jest.fn().mockRejectedValue(new Error()),
      });

      const result = service.findAll({
        createdAt: 'asc',
        limit: 1,
        page: 1,
      });

      expect(result).rejects.toThrow(new Error());
    });
  });
});
