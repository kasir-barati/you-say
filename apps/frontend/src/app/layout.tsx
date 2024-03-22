import { Roboto } from 'next/font/google';
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
  return (
    <html lang="en" className={roboto.className}>
      <body className="">{children}</body>
    </html>
  );
}
