import { act, render } from '@testing-library/react';
import { NotificationWrapper } from './notification-wrapper.component';

jest.mock('../../store', () => {
  return {
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn().mockReturnValue([]),
  };
});

describe('NotificationWrapper', () => {
  it('should show notification wrapper', async () => {
    const screen = await act(() => render(<NotificationWrapper />));

    const notificationWrapper = screen.getByTestId(
      'notification-wrapper',
    );

    expect(notificationWrapper).toBeInTheDocument();
  });
});
