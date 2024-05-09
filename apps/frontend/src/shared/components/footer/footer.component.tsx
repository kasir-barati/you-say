import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import Link from 'next/link';
import { Logo } from '../logo/logo.component';
import { SignUpButton } from '../sign-up-button/sign-up-modal.component';
import { SubscriptionTextField } from '../subscription-text-field/subscription-text-field.component';

export function Footer() {
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
        >
          <Grid2>
            <MuiLink
              component={Link}
              href="/"
              aria-label="Index page"
              data-test="logo-link-in-footer"
              underline="none"
            >
              <Logo variant="h4" color="black" />
            </MuiLink>
          </Grid2>
          <Grid2>
            <SignUpButton variant="text" color="inherit" />
          </Grid2>
          <Grid2>
            <MuiLink
              href="mailto:todo@email.com"
              color="inherit"
              component={Link}
              data-test="contact-us-link-in-footer"
            >
              Contact Us
            </MuiLink>
          </Grid2>
        </Grid2>
      </Container>
      <Divider />
      <Box sx={{ paddingY: 17 }}>
        <Grid2
          container
          rowGap={1}
          textAlign="center"
          alignContent="center"
          flexDirection="column"
        >
          <Grid2>
            <Logo variant="h4" color="black" />
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
