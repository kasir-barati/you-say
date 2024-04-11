import { Meta, StoryObj } from '@storybook/react';
import { NotificationIcon } from './notification-icon.component';

type Story = StoryObj<typeof NotificationIcon>;

export default {
  component: NotificationIcon,
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} satisfies Meta<typeof NotificationIcon>;

export const Error: Story = {
  args: {
    type: 'error',
  },
};
export const Info: Story = {
  args: {
    type: 'info',
  },
};
export const Success: Story = {
  args: {
    type: 'success',
  },
};
export const Warning: Story = {
  args: {
    type: 'warning',
  },
};
