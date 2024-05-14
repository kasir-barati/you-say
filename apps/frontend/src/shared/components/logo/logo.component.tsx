'use client';

import Typography from '@mui/material/Typography';
import { Leckerli_One } from 'next/font/google';

const leckerliOne = Leckerli_One({
  style: 'normal',
  weight: '400',
  subsets: ['latin'],
});

interface LogoProps {
  variant?: Parameters<typeof Typography>['0']['variant'];
  color?: Parameters<typeof Typography>['0']['color'];
}

// TODO: when theme is added, configure the font family
export function Logo({
  variant,
  color = 'white',
}: Readonly<LogoProps>) {
  return (
    <Typography
      {...(variant ? { variant } : {})}
      aria-label="Logo"
      className={leckerliOne.className}
      color={color}
    >
      you-say
    </Typography>
  );
}
