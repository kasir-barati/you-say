'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { FormEvent } from 'react';
import { useSubscribeToNewsletterMutation } from '../../api/newsletter-subscription.api';
import { useSubmit } from '../../hooks/use-submit.hook';

const inputProps = {
  'aria-label': 'Enter your email to subscribe for newsletter',
};
const InputProps = {
  sx: {
    borderRadius: 50,
    paddingLeft: 1.2,
    backgroundColor: 'white',
  },
  endAdornment: (
    <Button
      type="submit"
      variant="contained"
      aria-label="Subscribe"
      sx={{ borderRadius: 50, paddingX: 4 }}
    >
      Subscribe
    </Button>
  ),
};

export function SubHeader() {
  const submit = useSubmit({
    onSuccessRedirectTo: '/',
    successMessage: "We've subscribed you!",
    useMutation: useSubscribeToNewsletterMutation,
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit(event.currentTarget);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(70deg, #201878, #95326E)',
        paddingY: 17,
      }}
      component="form"
      onSubmit={handleSubmit}
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
          <TextField
            required
            fullWidth
            name="email"
            placeholder="email@example.com"
            autoComplete="email"
            InputProps={InputProps}
            inputProps={inputProps}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}
