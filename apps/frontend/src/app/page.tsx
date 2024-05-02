import { Metadata, Viewport } from 'next';
import { Header } from '../shared/components/header/header.component';

export const metadata: Metadata = {
  title: 'you-say',
  description: 'Welcome to the parallel world of knowledge',
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default function Index() {
  return (
    <div className="hi">
      <Header />
    </div>
  );
}
