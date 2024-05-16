'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { FormEvent } from 'react';
import { useSignUpMutation } from '../../shared/api/auth.api';
import { WhiteTextField } from '../../shared/components/white-textfield/white-textfield.component';
import { useSubmit } from '../../shared/hooks/use-submit.hook';

export default function SignUp() {
  const submit = useSubmit({
    useMutation: useSignUpMutation,
    successMessage: 'Signed up successfully, Now check your email!',
    onSuccessRedirectTo: '/',
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await submit(event.currentTarget);
  };

  return (
    <Container>
      <Stack
        spacing={2}
        paddingY={2}
        component="form"
        onSubmit={handleSubmit}
      >
        <WhiteTextField
          required
          fullWidth
          label="Name"
          name="firstName"
          placeholder="Name"
          autoFocus
          autoComplete="given-name"
        />
        <WhiteTextField
          required
          fullWidth
          label="Family"
          placeholder="Family"
          name="lastName"
          autoComplete="family-name"
        />
        <WhiteTextField
          required
          fullWidth
          type="email"
          label="Email"
          placeholder="email@example.com"
          name="email"
          autoComplete="email"
        />
        <Button
          data-test="sign-up-button"
          fullWidth
          variant="contained"
          type="submit"
        >
          Sign up
        </Button>
      </Stack>
    </Container>
  );
}
