'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

export function SubscriptionTextField({
  name = 'email',
}: Readonly<SubscriptionTextFieldProps>) {
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
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        required
        fullWidth
        name={name}
        placeholder="email@example.com"
        autoComplete="email"
        InputProps={InputProps}
        inputProps={inputProps}
      />
    </Box>
  );
}

interface SubscriptionTextFieldProps {
  /**
   * @default email
   */
  name?: string;
}
