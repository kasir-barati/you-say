'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import Link from 'next/link';
import { Divider } from '../divider/divider.component';
import { Logo } from '../logo/logo.component';
import { ShopButton } from '../shop-button/shop-button.component';
import { SignUpButton } from '../sign-up-button/sign-up-modal.component';
import { SubscriptionTextField } from '../subscription-text-field/subscription-text-field.component';

export function Footer() {
  const { isLoggedIn } = useFusionAuth();

  return (
    <Stack paddingY={3} rowGap={2}>
      <Divider />
      <Container>
        <Grid2
          container
          flexGrow={1}
          textAlign="center"
          alignItems="center"
          justifyContent="space-between"
          letterSpacing={3}
          rowGap={2}
        >
          <Grid2 sm="auto" xs={12}>
            <MuiLink
              component={Link}
              href="/"
              aria-label="Index page"
              data-test="logo-link-in-footer"
              underline="none"
              display="inline-flex"
            >
              <Logo variant="h4" />
            </MuiLink>
          </Grid2>
          <Grid2 sm="auto" xs={12}>
            {isLoggedIn ? (
              <ShopButton />
            ) : (
              <SignUpButton variant="text" color="inherit" />
            )}
          </Grid2>
          <Grid2 sm="auto" xs={12}>
            <MuiLink
              href="mailto:todo@email.com"
              color="inherit"
              component={Link}
              data-test="contact-us-link-in-footer"
              display="inline-flex"
            >
              Contact Us
            </MuiLink>
          </Grid2>
        </Grid2>
      </Container>
      <Divider />
      <Box
        sx={{ paddingY: 17, display: { xs: 'none', sm: 'block' } }}
      >
        <Grid2
          container
          rowGap={1}
          textAlign="center"
          alignContent="center"
          flexDirection="column"
        >
          <Grid2>
            <Logo variant="h4" />
          </Grid2>
          <Grid2>
            <Typography variant="body1" color="gray">
              Thoughts, comments, etc
            </Typography>
          </Grid2>
          <Grid2 xs={7} marginTop={4}>
            <SubscriptionTextField />
          </Grid2>
        </Grid2>
      </Box>
    </Stack>
  );
}
