import { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import { mockedFindAllPostsResponse } from '../../__mocks__/posts.mock';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { Latest } from './latest.component';

type Story = StoryObj<typeof Latest>;

export default {
  component: Latest,
  render() {
    return (
      <MockProvider>
        <Latest />
      </MockProvider>
    );
  },
} satisfies Meta<typeof Latest>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/posts?limit=3&createdAt=desc', () =>
          HttpResponse.json(mockedFindAllPostsResponse),
        ),
      ],
    },
  },
};
export const NoLatestPosts: Story = {};
