import { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import { mockedFindAllPostsResponse } from '../shared/__mocks__/posts.mock';
import { MockProvider } from '../shared/test-utils/mock-provider.test-util';
import Index from './page';

type Story = StoryObj<typeof Index>;

export default {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    msw: {
      handlers: [
        http.get('*/posts?limit=3&createdAt=desc', () =>
          HttpResponse.json(mockedFindAllPostsResponse),
        ),
      ],
    },
  },
  component: Index,
  render() {
    return (
      <MockProvider>
        <Index />
      </MockProvider>
    );
  },
} satisfies Meta<typeof Index>;

export const Default: Story = {};
