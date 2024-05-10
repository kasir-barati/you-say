import { FindAllPostsQuery } from '@shared';
import { PostApi, PostDto } from '../api-client';

describe('Post -- Validation', () => {
  const postApi: PostApi = new PostApi();

  describe('GET /posts', () => {
    it.each<FindAllPostsQuery>([
      { createdAt: 'asc', limit: 7, page: 1 },
      { createdAt: 'desc', limit: 3, page: 1 },
    ])(
      'should return $limit posts for $page page when it is sorted by createdAt in $createdAt order',
      async (queryParams) => {
        const {
          status,
          data: { limit, page, pages, items, data },
        } = await postApi.postControllerFindAll(queryParams);

        expect(status).toEqual(200);
        expect(limit).toEqual(queryParams.limit);
        expect(page).toEqual(queryParams.page);
        expect(pages).toEqual(expect.any(Number));
        expect(items).toEqual(expect.any(Number));
        expect(data[0]).toStrictEqual({
          id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          postImage: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          description: expect.any(String),
          fusionAuthUser: {
            email: expect.any(String),
            lastName: expect.any(String),
            firstName: expect.any(String),
            fusionAuthId: expect.any(String),
          },
        } as PostDto);
      },
    );
  });
});
