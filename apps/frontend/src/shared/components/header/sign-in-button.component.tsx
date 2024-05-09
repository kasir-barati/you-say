import Button from '@mui/material/Button';
import { useModal } from '../../hooks/use-modal.hook';
import { AuthModal } from '../auth-modal/auth-modal.component';

const buttonStyle = {
  color: 'black',
  fontWeight: 'bold',
  textTransform: 'none',
};

export function SignInButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        title="Sign in"
        aria-label="Sign in"
        onClick={openModal}
        sx={buttonStyle}
      >
        Sign in
      </Button>
      <AuthModal
        isOpen={isOpen}
        defaultModal="signIn"
        closeModal={closeModal}
      />
    </>
  );
}
