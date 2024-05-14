'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormEvent } from 'react';
import { useSignUpMutation } from '../../api/auth.api';
import { useSubmit } from '../../hooks/use-submit.hook';

export function SignUpForm({
  closeModal,
}: Readonly<SignUpFormProps>) {
  const submit = useSubmit({
    useMutation: useSignUpMutation,
    successMessage: 'Signed up successfully, Now check your email!',
    onSuccessRedirectTo: '/',
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const whereCompletedSuccessfully = await submit(
      event.currentTarget,
    );

    if (whereCompletedSuccessfully) {
      closeModal();
    }
  };

  return (
    <Stack
      spacing={2}
      paddingY={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        required
        fullWidth
        label="Name"
        name="firstName"
        placeholder="Name"
        autoFocus
        autoComplete="given-name"
      />
      <TextField
        required
        fullWidth
        label="Family"
        placeholder="Family"
        name="lastName"
        autoComplete="family-name"
      />
      <TextField
        required
        fullWidth
        type="email"
        label="Email"
        placeholder="email@example.com"
        name="email"
        autoComplete="email"
        inputProps={{ 'data-test': 'sign-up-form-register-input' }}
      />
      <Button
        data-test="sign-up-button-in-sign-up-form"
        fullWidth
        variant="contained"
        type="submit"
      >
        Sign up
      </Button>
    </Stack>
  );
}

interface SignUpFormProps {
  closeModal: () => void;
}
