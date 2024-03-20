import './global.css';

export const metadata = {
  title: 'Welcome to you-say',
  description: 'Where you can talk and read!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
