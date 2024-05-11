import { Metadata, Viewport } from 'next';
import { Latest } from '../shared/components/latest/latest.component';
import { SubHeader } from '../shared/components/sub-header/sub-header.component';

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
    <div>
      <SubHeader />
      <Latest />
    </div>
  );
}
