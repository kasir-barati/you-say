import { Meta, StoryObj } from '@storybook/react';
import { ServiceUnavailable } from './service-unavailable.component';

type Story = StoryObj<typeof ServiceUnavailable>;

export default {
  component: ServiceUnavailable,
} satisfies Meta<typeof ServiceUnavailable>;

export const Default: Story = {};
