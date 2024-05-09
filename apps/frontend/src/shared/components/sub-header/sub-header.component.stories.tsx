import { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { SubHeader } from './sub-header.component';

type Story = StoryObj<typeof SubHeader>;

export default {
  component: SubHeader,
  render() {
    return (
      <MockProvider>
        <SubHeader />
      </MockProvider>
    );
  },
  parameters: {
    msw: {
      handlers: [
        http.post('*/newsletter-subscription', () =>
          HttpResponse.json(),
        ),
      ],
    },
  },
} satisfies Meta<typeof SubHeader>;

export const Default: Story = {};
