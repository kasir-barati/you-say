'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';

export function ShopButton() {
  return (
    <Button href="/shop" variant="contained" LinkComponent={Link}>
      Shop
    </Button>
  );
}
