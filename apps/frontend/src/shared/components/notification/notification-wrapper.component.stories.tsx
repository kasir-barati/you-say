import { wait } from '@shared';
import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, within } from '@storybook/test';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { NotificationWrapper } from './notification-wrapper.component';

type Story = StoryObj<typeof NotificationWrapper>;

export default {
  component: NotificationWrapper,
  render() {
    return (
      <MockProvider>
        <NotificationWrapper />
      </MockProvider>
    );
  },
} satisfies Meta<typeof NotificationWrapper>;

export const Default: Story = {};
export const WithNotifications: Story = {
  render() {
    return (
      <MockProvider
        initialState={{
          notifications: {
            notifications: [
              {
                createdAtTimestamp: Date.now(),
                id: 'error-id',
                message: 'This is an error',
                type: 'error',
              },
            ],
          },
        }}
      >
        <NotificationWrapper />
      </MockProvider>
    );
  },
  async play({ canvasElement, step }) {
    const canvas = within(canvasElement);

    await step('validate UI/UX of the notification', () => {
      // FIXME: Found multiple elements by: [data-test="notification-wrapper"]
      const notificationWrapper = canvas.getAllByTestId(
        'notification-wrapper',
      )[0];
      expect(notificationWrapper).toHaveClass(
        'absolute',
        'right-0',
        'top-0',
        'z-50',
        'm-4',
        'mt-48',
        'flex',
        'flex-col',
        'items-end',
        'gap-4',
      );
    });
    await step(
      'validate auto close functionality of notifications',
      async () => {
        const errorNotification = canvas.getAllByText(
          'This is an error',
        )[0];

        // FIXME: create a bug report in the storybook lib:
        // 1. getAllByText even though there is only one element in the DOM or that's what I can see
        // 2. waitForElementToBeRemoved cannot see that the element is removed and no matter how much I increase the timeout it throws a timeout error: 'Timed out in waitForElementToBeRemoved.'
        // await waitForElementToBeRemoved(() => errorNotification, {
        //   timeout: 3100,
        //   interval: 500,
        // });
        await wait(3100);
        expect(errorNotification).not.toBeInTheDocument();
      },
    );
  },
};
export const CloseNotificationsAfterClick: Story = {
  render() {
    return (
      <MockProvider
        initialState={{
          notifications: {
            notifications: [
              {
                createdAtTimestamp: Date.now() + 1500,
                id: 'warning-id',
                message: 'This is a warning',
                type: 'warning',
              },
            ],
          },
        }}
      >
        <NotificationWrapper />
      </MockProvider>
    );
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const notification = canvas.getAllByText('This is a warning')[0];
    await fireEvent.click(notification);
    // FIXME: because there are apparently two element in the DOM I cannot test it right now, waiting for the Storybook issue!
    // expect(notification).not.toBeInTheDocument(); // Use waitForElementToBeRemoved
  },
};
