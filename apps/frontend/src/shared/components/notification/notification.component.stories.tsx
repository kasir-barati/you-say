import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, within } from '@storybook/test';
import { Notification } from './notification.component';

type Story = StoryObj<typeof Notification>;

export default {
  component: Notification,
} satisfies Meta<typeof Notification>;

export const Success: Story = {
  args: {
    alert: {
      createdAtTimestamp: Date.now(),
      id: 'success-id',
      type: 'success',
      message: 'I am success!',
    },
    onClick: fn(),
  },
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);
    const notification = canvas.getByTestId(
      `notification-${args.alert.id}`,
    );

    await fireEvent.click(notification);

    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const Error: Story = {
  args: {
    alert: {
      createdAtTimestamp: Date.now(),
      id: 'error-id',
      type: 'error',
      message: 'I am error!',
    },
    onClick: fn(),
  },
};
export const Warning: Story = {
  args: {
    alert: {
      createdAtTimestamp: Date.now(),
      id: 'warning-id',
      type: 'warning',
      message: 'I am warning!',
    },
    onClick: fn(),
  },
};
export const Info: Story = {
  args: {
    alert: {
      createdAtTimestamp: Date.now(),
      id: 'info-id',
      type: 'info',
      message: 'I am info!',
    },
    onClick: fn(),
  },
};
