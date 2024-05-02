import { generateRandomString } from '@shared';
import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { Notification } from './notification.component';

type Story = StoryObj<typeof Notification>;

export default {
  component: Notification,
} satisfies Meta<typeof Notification>;

export const SuccessNotification: Story = {
  render() {
    return (
      <MockProvider
        initialState={{
          notifications: [
            {
              id: generateRandomString(),
              message: 'Success notification',
              type: 'success',
              open: true,
              timeout: 10000,
            },
          ],
        }}
      >
        <Notification />
      </MockProvider>
    );
  },
  play({ canvasElement }) {
    const canvas = within(canvasElement);
    const notification = canvas.getByText('Success notification');
    expect(notification).toBeInTheDocument();
  },
};
export const ErrorNotification: Story = {
  render() {
    return (
      <MockProvider
        initialState={{
          notifications: [
            {
              id: generateRandomString(),
              message: 'Error notification',
              type: 'error',
              open: true,
              timeout: 10000,
            },
          ],
        }}
      >
        <Notification />
      </MockProvider>
    );
  },
  play({ canvasElement }) {
    const canvas = within(canvasElement);
    const notification = canvas.getByText('Error notification');
    expect(notification).toBeInTheDocument();
  },
};
export const InfoNotification: Story = {
  render() {
    return (
      <MockProvider
        initialState={{
          notifications: [
            {
              id: generateRandomString(),
              message: 'Info notification',
              type: 'info',
              open: true,
              timeout: 10000,
            },
          ],
        }}
      >
        <Notification />
      </MockProvider>
    );
  },
  play({ canvasElement }) {
    const canvas = within(canvasElement);
    const notification = canvas.getByText('Info notification');
    expect(notification).toBeInTheDocument();
  },
};
export const WarningNotification: Story = {
  render() {
    return (
      <MockProvider
        initialState={{
          notifications: [
            {
              id: generateRandomString(),
              message: 'Warning notification',
              type: 'warning',
              open: true,
              timeout: 10000,
            },
          ],
        }}
      >
        <Notification />
      </MockProvider>
    );
  },
  play({ canvasElement }) {
    const canvas = within(canvasElement);
    const notification = canvas.getByText('Warning notification');
    expect(notification).toBeInTheDocument();
  },
};
