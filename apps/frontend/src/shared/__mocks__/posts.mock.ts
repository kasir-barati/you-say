import { FindAllPostsResponse, Post } from '@shared';

const mockedPost: Post = {
  title: 'Post title',
  content: '# Markdown',
  id: '663a777cfbf2b59b3392b1f2',
  description: 'Post description',
  postImage:
    'https://st2.depositphotos.com/2001755/5443/i/450/depositphotos_54431143-stock-photo-beautiful-landscape.jpg',
  fusionAuthUser: {
    email: 'anna.joe@yahoo.com',
    firstName: 'Anna',
    lastName: 'Joe',
    fusionAuthId: 'd881bc4b-9380-4daa-9da7-f90b58557143',
  },
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};
export const mockedFindAllPostsResponse: FindAllPostsResponse = {
  data: [mockedPost, mockedPost],
  page: 1,
  limit: 3,
  pages: 1,
  items: 1,
};
