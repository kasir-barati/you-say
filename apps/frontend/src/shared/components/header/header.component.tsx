'use client';

import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { DesktopToolbar } from './desktop-toolbar/desktop-toolbar.component';
import { MobileToolbar } from './mobile-toolbar/mobile-toolbar.componenrt';

export function Header({ headerId }: Readonly<HeaderProps>) {
  // const { isAuthenticated, login, logout } = useFusionAuth();
  const isMobile = useMediaQuery('(max-width:600px)', {
    noSsr: true,
  });

  return (
    <AppBar position="static" data-test="AppBar">
      <Container>
        {isMobile ? (
          <MobileToolbar id={headerId} />
        ) : (
          <DesktopToolbar id={headerId} />
        )}
      </Container>
    </AppBar>
  );
}

interface HeaderProps {
  headerId: string;
}
