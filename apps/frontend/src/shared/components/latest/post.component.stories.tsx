import { generateRandomString } from '@shared';
import { Meta, StoryObj } from '@storybook/react';
import { Post } from './post.component';

type Story = StoryObj<typeof Post>;

export default {
  component: Post,
} satisfies Meta<typeof Post>;

export const Default: Story = {
  args: {
    title: 'Post title',
    description: `${generateRandomString()}`,
    updatedAt: new Date(),
    user: {
      firstName: 'Mohammad Jawad',
    },
    postImage:
      'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
  },
};
