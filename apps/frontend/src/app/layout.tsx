'use client';

import { Roboto } from 'next/font/google';
import { Application } from '../shared/components/application/application.component';
import { getStore } from '../shared/store';
import './global.css';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = getStore();

  return (
    <html lang="en" className={roboto.className}>
      <body className="">
        <Application store={store}>{children}</Application>
      </body>
    </html>
  );
}
