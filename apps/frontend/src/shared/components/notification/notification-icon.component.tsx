import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import { Alert } from './notification.slice';

function typeValidator(type: Alert['type']): never | void {
  const validTypes: Alert['type'][] = [
    'error',
    'info',
    'success',
    'warning',
  ];
  if (!validTypes.includes(type)) {
    throw 'Invalid notification type';
  }
}

interface NotificationIconProps {
  type: Alert['type'];
}

export function NotificationIcon({
  type,
}: Readonly<NotificationIconProps>) {
  typeValidator(type);

  const iconClassName = 'h-6 w-6 text-white';
  const dataTest = 'notification-icon';

  if (type === 'error') {
    return (
      <XCircleIcon
        data-test={dataTest}
        aria-label="Notification error icon"
        className={iconClassName}
      />
    );
  }

  if (type === 'success') {
    return (
      <CheckCircleIcon
        data-test={dataTest}
        aria-label="Notification success icon"
        className={iconClassName}
      />
    );
  }

  if (type === 'warning') {
    return (
      <ExclamationTriangleIcon
        data-test={dataTest}
        aria-label="Notification warning icon"
        className={iconClassName}
      />
    );
  }

  return (
    <InformationCircleIcon
      data-test={dataTest}
      aria-label="Notification info icon"
      className={iconClassName}
    />
  );
}
