import { Metadata, Viewport } from 'next';
import { BackToTop } from '../shared/components/back-to-top/back-to-top.component';
import { Footer } from '../shared/components/footer/footer.component';
import { Header } from '../shared/components/header/header.component';
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
      <Header headerId="back-to-top-anchor" />
      <SubHeader />
      <Latest />
      <Footer />
      <BackToTop elementId="back-to-top-anchor" />
    </div>
  );
}
