import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { MouseEvent, PropsWithChildren } from 'react';

export function ScrollTop({
  children,
  anchorId,
}: Readonly<PropsWithChildren<ScrollTopProps>>) {
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector(`#${anchorId}`);

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  };

  return (
    <Fade easing="linear" in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

interface ScrollTopProps {
  anchorId: string;
}
