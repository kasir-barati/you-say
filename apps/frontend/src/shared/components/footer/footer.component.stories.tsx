import { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { Footer } from './footer.component';

type Story = StoryObj<typeof Footer>;

export default {
  component: Footer,
  render() {
    return (
      <MockProvider>
        <Footer />
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
} satisfies Meta<typeof Footer>;
export const Default: Story = {};
