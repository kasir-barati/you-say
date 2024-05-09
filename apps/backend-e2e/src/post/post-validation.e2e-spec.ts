import { FindAllPostsQuery } from '@shared';
import { PostApi } from '../api-client';

describe('Post -- Validation', () => {
  const postApi: PostApi = new PostApi();

  describe('GET /posts', () => {
    it.each<FindAllPostsQuery>([
      { createdAt: 'asc', limit: 10, page: 1 },
      { createdAt: 'desc', limit: 3, page: 91 },
    ])(
      'should pass the validation layer: %o',
      async (queryParams) => {
        const { status } =
          await postApi.postControllerFindAll(queryParams);

        expect(status).not.toEqual(400);
      },
    );

    it.each([
      { createdAt: 'asc', limit: 10, page: 0 },
      { createdAt: 'desc', limit: 0, page: 1 },
      { createdAt: 'trash', limit: 'invalid', page: 1 },
      { createdAt: 'asc', limit: 3, page: -123 },
      { createdAt: 'desc', limit: 3.9812, page: 91 },
    ])(
      'should not pass the validation layer: %o',
      async (queryParams) => {
        const { status } = await postApi.postControllerFindAll(
          queryParams as FindAllPostsQuery,
          {
            validateStatus(status) {
              return status > 200;
            },
          },
        );

        expect(status).toEqual(400);
      },
    );
  });
});
