import { Post, SinonMock } from '@shared';
import { PostDocument } from '../entities/post.entity';
import { PostSanitizer } from './post-sanitizer.service';

describe('PostSanitizer', () => {
  const sanitizer = new PostSanitizer();
  it('should sanitize a post', () => {
    const unsanitizedPost = SinonMock.with<PostDocument>({
      id: '663a6a4c362adc2df944aae6',
      title: 'post title',
      content: '# post content in markdown',
      description: 'simple text post description',
      fusionAuthUser: {
        email: 'bao.chen@gmail.com',
        firstName: 'Bao',
        lastName: 'Chen',
        fusionAuthId: 'd881bc4b-9380-4daa-9da7-f90b58557143',
      },
      postImage:
        'http://you-say.com/images/73136da51c245e80edc6ccfe44888a99/1015f/post-image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const expectedResult: Post = {
      id: '663a6a4c362adc2df944aae6',
      title: 'post title',
      content: '# post content in markdown',
      description: 'simple text post description',
      fusionAuthUser: {
        email: 'bao.chen@gmail.com',
        firstName: 'Bao',
        lastName: 'Chen',
        fusionAuthId: 'd881bc4b-9380-4daa-9da7-f90b58557143',
      },
      postImage:
        'http://you-say.com/images/73136da51c245e80edc6ccfe44888a99/1015f/post-image.jpg',
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    const post = sanitizer.toPost(unsanitizedPost);

    expect(post).toStrictEqual(expectedResult);
  });

  it.each<undefined | null>([undefined, null])(
    'should throw an error if provided data is %p',
    (data) => {
      expect(() => sanitizer.toPost(data as PostDocument)).toThrow(
        '[Error-c3d4c6e9e2] No data provided!',
      );
    },
  );
});
