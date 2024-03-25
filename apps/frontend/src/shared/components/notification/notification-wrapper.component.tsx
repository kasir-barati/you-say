import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { Notification } from './notification.component';
import { removeNotification } from './notification.slice';

export function NotificationWrapper() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notifications.notifications,
  );

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      notifications
        .filter(
          ({ createdAtTimestamp }) =>
            createdAtTimestamp < Date.now() - 3000,
        )
        .forEach(({ id }) => dispatch(removeNotification(id)));
    }, 500);

    return () => clearInterval(interval);
  }, [dispatch, notifications]);

  // #region handlers
  const closeNotificationHandler = (id: string) => {
    dispatch(removeNotification(id));
  };
  // #endregion

  return (
    <div
      className="absolute right-0 top-0 z-50 m-4 mt-48 flex flex-col items-end gap-4"
      data-test="notification-wrapper"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          alert={notification}
          onClick={closeNotificationHandler}
        />
      ))}
    </div>
  );
}
