'use client';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const containerStyle = {
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: '0px 0px 10px 5px rgba(0, 0, 0, 0.1)',
  width: '40%',
  borderRadius: '20px',
};

export function ServiceUnavailable() {
  return (
    <Container sx={containerStyle}>
      <Stack spacing={2} marginX={3} marginY={13}>
        <Typography variant="h3" fontWeight="bold">
          Be right back soon.
        </Typography>
        <Typography variant="h6" color="slategray">
          We&apos;re working on our site to give you the best
          experience, and will come back soon.
        </Typography>
      </Stack>
    </Container>
  );
}
