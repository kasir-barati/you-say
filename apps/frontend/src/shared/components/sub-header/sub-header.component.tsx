'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { SubscriptionTextField } from '../subscription-text-field/subscription-text-field.component';

export function SubHeader() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #72F1EA, #010023)',
        paddingY: 17,
      }}
    >
      <Grid2
        container
        gap={7}
        flexDirection="column"
        textAlign="center"
        alignContent="center"
      >
        <Grid2>
          <Typography variant="h3" fontWeight="bold" color="white">
            Thoughts, comments, etc
          </Typography>
        </Grid2>
        <Grid2>
          <SubscriptionTextField />
        </Grid2>
      </Grid2>
    </Box>
  );
}
