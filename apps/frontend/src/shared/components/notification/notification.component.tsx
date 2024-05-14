'use client';

import { SnackbarCloseReason, SnackbarOrigin } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { SyntheticEvent } from 'react';
import { useAppSelector } from '../../store';
import { useNotification } from './use-notification.hook';

const anchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

export function Notification() {
  const notification = useAppSelector(
    (state) => state.notifications,
  )[0];
  const { clearNotification } = useNotification();
  const handleClose = (
    _event: Event | SyntheticEvent<unknown, Event>,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    clearNotification(notification.id);
  };

  if (!notification) {
    return <></>;
  }

  return (
    <Snackbar
      // specifying a key here is necessary to avoid the following issue: it won't remove second snackbar but when you click on the X button it will and show the next one. It is because react could not detect that this component was changed!
      key={notification.id}
      open={notification.open}
      autoHideDuration={notification.timeout}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        aria-label="alert"
        variant="filled"
        onClose={handleClose}
        severity={notification.type}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
