import { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { SubscriptionTextField } from './subscription-text-field.component';

type Story = StoryObj<typeof SubscriptionTextField>;

export default {
  component: SubscriptionTextField,
  render() {
    return (
      <MockProvider>
        <SubscriptionTextField />
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
} satisfies Meta<typeof SubscriptionTextField>;
export const Default: Story = {};
