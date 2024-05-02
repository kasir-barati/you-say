import { useFusionAuth } from '@fusionauth/react-sdk';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { usePathname } from 'next/navigation';

export function SignInModal() {
  const pathname = usePathname();
  const { login } = useFusionAuth();
  const handleLogin = () => {
    login(pathname ?? undefined);
  };

  return (
    <Stack paddingY={2} textAlign="center" spacing={2}>
      <Button
        title="Continue signing in..."
        aria-label="Continue signing in..."
        color="primary"
        onClick={handleLogin}
        fullWidth
        variant="contained"
      >
        Continue signing in...
      </Button>
    </Stack>
  );
}
