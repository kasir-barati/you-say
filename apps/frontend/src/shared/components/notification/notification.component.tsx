import classNames from 'classnames';
import { NotificationIcon } from './notification-icon.component';
import { Alert } from './notification.slice';

interface NotificationProps {
  alert: Alert;
  onClick(id: string): void;
}

export function Notification({
  alert,
  onClick,
}: Readonly<NotificationProps>) {
  const { message, type, id } = alert;

  // #region handlers
  const clickHandler = () => {
    onClick(id);
  };
  // #endregion

  return (
    <div
      data-test={`notification-${id}`}
      className={classNames(
        'flex min-h-10 w-72 items-center gap-2 rounded p-3 text-sm font-medium shadow-lg ring-1 ring-slate-400/10',
        { 'bg-cyan-600': type === 'info' },
        { 'bg-yellow-600': type === 'warning' },
        { 'bg-rose-600': type === 'error' },
        { 'bg-lime-600': type === 'success' },
      )}
      onClick={clickHandler}
    >
      <NotificationIcon type={type} />
      <p>{message}</p>
    </div>
  );
}
