'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormEvent } from 'react';
import { useSignUpMutation } from '../../shared/api/auth.api';
import { useSubmit } from '../../shared/hooks/use-submit.hook';

const InputLabelProps = {
  style: { color: 'white' },
};
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    '&.MuiInputBase-root fieldset': {
      borderColor: 'white',
    },
  },
};
const inputProps = {
  sx: {
    '&::placeholder': {
      color: 'white',
      opacity: 1, // otherwise firefox shows a lighter color
    },
    'color': 'white',
  },
};

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
        <TextField
          required
          fullWidth
          label="Name"
          name="firstName"
          placeholder="Name"
          autoFocus
          autoComplete="given-name"
          sx={textFieldSx}
          inputProps={inputProps}
          InputLabelProps={InputLabelProps}
        />
        <TextField
          required
          fullWidth
          label="Family"
          placeholder="Family"
          name="lastName"
          autoComplete="family-name"
          sx={textFieldSx}
          inputProps={inputProps}
          InputLabelProps={InputLabelProps}
        />
        <TextField
          required
          fullWidth
          type="email"
          label="Email"
          placeholder="email@example.com"
          name="email"
          autoComplete="email"
          sx={textFieldSx}
          inputProps={inputProps}
          InputLabelProps={InputLabelProps}
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
