'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Grid2 from '@mui/material/Unstable_Grid2';
import Link from 'next/link';
import { Logo } from '../../logo/logo.component';
import { SignUpButton } from '../../sign-up-button/sign-up-modal.component';
import { SearchModal } from '../search-modal.component';
import { SignInButton } from '../sign-in-button.component';
import { AccountButton } from './account-button.component';

export function DesktopToolbar({
  id,
}: Readonly<DesktopToolbarProps>) {
  const { isAuthenticated: isLoggedIn } = useFusionAuth();

  return (
    <Toolbar disableGutters id={id}>
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
          {isLoggedIn ? (
            <AccountButton />
          ) : (
            <>
              <SignInButton />
              <SignUpButton />
            </>
          )}
        </Grid2>
      </Grid2>
    </Toolbar>
  );
}

interface DesktopToolbarProps {
  id: string;
}
