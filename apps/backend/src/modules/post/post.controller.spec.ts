import { SinonMock, SinonMockType } from '@shared';
import { FindAllResponseDto } from './dto/find-all-response.dto';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';

describe('PostController', () => {
  let controller: PostController;
  let postService: SinonMockType<PostService>;

  beforeEach(() => {
    postService = SinonMock.of<PostService>(PostService);
    controller = new PostController(postService);
  });

  describe('GET /posts', () => {
    it('should call postService.findAll and return the result', () => {
      const findAllReturnValue = {
        page: 1,
        data: [],
        items: 1,
        limit: 1,
        pages: 1,
      } as FindAllResponseDto;
      postService.findAll.resolves(findAllReturnValue);

      const result = controller.findAll({
        createdAt: 'asc',
        limit: 1,
        page: 1,
      });

      expect(result).resolves.toStrictEqual(findAllReturnValue);
    });

    it('should propagate postService.findAll thrown error', () => {
      postService.findAll.rejects(new Error());

      const result = controller.findAll({
        createdAt: 'asc',
        limit: 1,
        page: 1,
      });

      expect(result).rejects.toThrow(new Error());
    });
  });
});
