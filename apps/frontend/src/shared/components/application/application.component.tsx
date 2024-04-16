import { Store } from '@reduxjs/toolkit';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../store';
import { setUser } from '../../store/auth.slice';
import { getCookie } from '../../utils/get-cookie.util';
import { getDecodedIdToken } from '../../utils/get-decoded-id-token.util';
import { NotificationWrapper } from '../notification/notification-wrapper.component';

interface ApplicationProps {
  store: Store;
}

export function Application({
  children,
  store,
}: Readonly<PropsWithChildren<ApplicationProps>>) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  const idTokenCookie = getCookie('id_token');

  if (idTokenCookie && !isLoggedIn) {
    const decodedIdToken = getDecodedIdToken(idTokenCookie);

    if (decodedIdToken?.roles && decodedIdToken?.sub) {
      dispatch(
        setUser({
          roles: decodedIdToken.roles,
          sub: decodedIdToken.sub,
        }),
      );
    }
  }

  return (
    <Provider store={store}>
      <NotificationWrapper />
      {children}
    </Provider>
  );
}
