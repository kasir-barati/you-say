'use client';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Grid2 from '@mui/material/Unstable_Grid2';
import Link from 'next/link';
import { Logo } from '../logo/logo.component';
import { SearchModal } from './search-modal.component';
import { SignInButton } from './sign-in-button.component';
import { SignUpButton } from './sign-up-modal.component';

export function Header() {
  // const { isAuthenticated, login, logout } = useFusionAuth();

  return (
    <AppBar position="static" data-test="AppBar">
      <Container>
        <Toolbar disableGutters>
          <Grid2
            container
            flexGrow={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid2 letterSpacing={1.2}>
              <MuiLink
                href="/"
                color="#fff"
                underline="none"
                fontWeight="bold"
                component={Link}
                data-test="home-link"
                marginRight={4}
              >
                Home
              </MuiLink>
              <MuiLink
                href="/about"
                color="#fff"
                underline="none"
                fontWeight="bold"
                component={Link}
                data-test="about-link"
              >
                About
              </MuiLink>
            </Grid2>
            <Grid2>
              <MuiLink
                component={Link}
                href="/"
                aria-label="Index page"
                data-test="logo-link"
              >
                <Logo variant="h4" />
              </MuiLink>
            </Grid2>
            <Grid2>
              <SearchModal />
              <SignInButton />
              <SignUpButton />
            </Grid2>
          </Grid2>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
