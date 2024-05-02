import Button from '@mui/material/Button';
import { useModal } from '../../hooks/use-modal.hook';
import { AuthModal } from './auth-modal.component';

const buttonStyle = {
  fontWeight: 'bold',
  textTransform: 'none',
};

export function SignUpButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        title="Sign up"
        aria-label="Sign up"
        variant="contained"
        onClick={openModal}
        color="info"
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
