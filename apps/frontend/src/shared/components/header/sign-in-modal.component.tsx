'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { usePathname } from 'next/navigation';

export function SignInModal() {
  const pathname = usePathname();
  const { login: startLogin } = useFusionAuth();
  const handleClick = () => {
    startLogin(pathname ?? undefined);
  };

  return (
    <Stack paddingY={2} textAlign="center" spacing={2}>
      <Button
        title="Continue signing in..."
        aria-label="Continue signing in..."
        color="primary"
        onClick={handleClick}
        fullWidth
        variant="contained"
      >
        Continue signing in...
      </Button>
    </Stack>
  );
}
