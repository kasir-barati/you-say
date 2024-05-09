'use client';

import { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';
import { useModal } from '../../hooks/use-modal.hook';
import { AuthModal } from '../auth-modal/auth-modal.component';

const buttonStyle = {
  fontWeight: 'bold',
  textTransform: 'none',
};

export function SignUpButton({
  variant = 'contained',
  color = 'info',
}: Readonly<SignUpButtonProps>) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        title="Sign up"
        aria-label="Sign up"
        variant={variant}
        onClick={openModal}
        color={color}
        sx={buttonStyle}
      >
        Sign up
      </Button>
      <AuthModal
        isOpen={isOpen}
        defaultModal="signUp"
        closeModal={closeModal}
      />
    </>
  );
}

interface SignUpButtonProps {
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
}
