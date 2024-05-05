import { Meta, StoryObj } from '@storybook/react';
import { MockProvider } from '../shared/test-utils/mock-provider.test-util';
import Index from './page';

type Story = StoryObj<typeof Index>;

export default {
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
