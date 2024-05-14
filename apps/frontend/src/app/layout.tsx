// import '@mdxeditor/editor/style.css';
// import { Viewport } from 'next';
// import { Roboto } from 'next/font/google';
// import { Application } from '../shared/components/application/application.component';
import './global.css';

// const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
// });

// export const viewport: Viewport = {
//   initialScale: 1,
//   width: 'device-width',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // className={roboto.className}
    >
      <body>{/* <Application>{children}</Application> */}</body>
    </html>
  );
}
