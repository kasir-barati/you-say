'use client';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { ScrollTop } from './scroll-top.component';

export function BackToTop({ elementId }: Readonly<BackToTopProps>) {
  return (
    <ScrollTop anchorId={elementId}>
      <Fab size="small" aria-label="scroll back to top">
        <KeyboardArrowUpIcon />
      </Fab>
    </ScrollTop>
  );
}

interface BackToTopProps {
  elementId: string;
}
