import { generateRandomString } from '@shared';
import { act, render } from '@testing-library/react';
import { Notification } from './notification.component';
import { Alert } from './notification.slice';

// TODO: test onClick in storybook
describe('Notification', () => {
  it('should pass down props to the notification component', async () => {
    const alert: Alert = {
      id: generateRandomString(),
      message: generateRandomString(),
      createdAtTimestamp: Date.now(),
      type: 'error',
    };
    const screen = await act(() =>
      render(<Notification onClick={jest.fn()} alert={alert} />),
    );

    const notification = screen.getByTestId(
      `notification-${alert.id}`,
    );

    expect(notification).toBeInTheDocument();
  });
});
