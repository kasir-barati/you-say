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
    const notification = canvas.getAllByText(
      'Success notification',
    )[0];
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
    const notification = canvas.getAllByText('Error notification')[0];
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
    const notification = canvas.getAllByText('Info notification')[0];
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
    const notification = canvas.getAllByText(
      'Warning notification',
    )[0];
    expect(notification).toBeInTheDocument();
  },
};
