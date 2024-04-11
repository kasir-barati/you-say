import { act, render } from '@testing-library/react';
import { NotificationIcon } from './notification-icon.component';
import { Alert } from './notification.slice';

describe('NotificationIcon', () => {
  it.each<Alert['type']>(['success', 'error', 'warning', 'info'])(
    'should return a/an %s notification icon',
    async (type) => {
      const screen = await act(() =>
        render(<NotificationIcon type={type} />),
      );

      const icon = screen.getByLabelText(`Notification ${type} icon`);

      expect(icon).toBeInTheDocument();
    },
  );
});
