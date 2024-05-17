'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import Button from '@mui/material/Button';

export function SingOutButton() {
  const { logout: startLogout } = useFusionAuth();

  return <Button onClick={startLogout}>Sign out</Button>;
}
