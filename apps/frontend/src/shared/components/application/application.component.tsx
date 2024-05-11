'use client';

import { FusionAuthProvider } from '@fusionauth/react-sdk';
import CssBaseline from '@mui/material/CssBaseline';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { fusionAuthConfig } from '../../../config';
import { getStore } from '../../store';
import { BackToTop } from '../back-to-top/back-to-top.component';
import { Footer } from '../footer/footer.component';
import { Header } from '../header/header.component';
import { Notification } from '../notification/notification.component';

export function Application({
  children,
}: Readonly<PropsWithChildren>) {
  const store = getStore();

  return (
    <Provider store={store}>
      <CssBaseline />
      <Notification />
      <FusionAuthProvider {...fusionAuthConfig}>
        <Header headerId="back-to-top-anchor" />
        {children}
        <Footer />
        <BackToTop elementId="back-to-top-anchor" />
      </FusionAuthProvider>
    </Provider>
  );
}
