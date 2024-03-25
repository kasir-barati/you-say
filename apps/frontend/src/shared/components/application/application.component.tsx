import { Store } from '@reduxjs/toolkit';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { NotificationWrapper } from '../notification/notification-wrapper.component';

interface ApplicationProps {
  store: Store;
}

export function Application({
  children,
  store,
}: Readonly<PropsWithChildren<ApplicationProps>>) {
  return (
    <Provider store={store}>
      <NotificationWrapper />
      {children}
    </Provider>
  );
}
