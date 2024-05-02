import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { Logo } from '../logo/logo.component';
import { ModalBox } from './modal-box.component';
import { SignInModal } from './sign-in-modal.component';
import { SignUpForm } from './sign-up-form.component';

export function AuthModal({
  isOpen,
  closeModal,
  defaultModal,
}: AuthModalProp) {
  const [isSignInModal, setIsSignInModal] = useState(
    defaultModal === 'signIn',
  );
  const itIsSignUpModal = () => setIsSignInModal(false);
  const itIsSignInModal = () => setIsSignInModal(true);
  const closeModalAndResetIsSignInModal = () => {
    closeModal();

    switch (defaultModal) {
      case 'signIn':
        itIsSignInModal();
        break;
      case 'signUp':
        itIsSignUpModal();
        break;
    }
  };
  const title = useMemo(() => {
    if (isSignInModal) {
      return (
        <Typography data-test="auth-modal-sign-in-title" variant="h4">
          Sign in
        </Typography>
      );
    }
    return <Logo variant="h4" color="black" />;
  }, [isSignInModal]);
  const content = isSignInModal ? (
    <SignInModal />
  ) : (
    <SignUpForm closeModal={closeModalAndResetIsSignInModal} />
  );
  const togglerComponent = useMemo(() => {
    if (isSignInModal) {
      return toggler({
        text: "Don't have an account?",
        buttonText: 'Create one!',
        onClick: itIsSignUpModal,
      });
    }
    return toggler({
      text: 'Already a member?',
      buttonText: 'Then login!',
      onClick: itIsSignInModal,
    });
  }, [isSignInModal]);

  return (
    <Modal open={isOpen} onClose={closeModalAndResetIsSignInModal}>
      <ModalBox data-test="auth-modal" bgcolor="white">
        <DialogTitle
          component="div"
          justifyContent="space-between"
          display="flex"
        >
          <span></span>
          {title}
          <IconButton
            data-test="auth-modal-close-button"
            onClick={closeModalAndResetIsSignInModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Stack spacing={2}>
            {content}
            {togglerComponent}
          </Stack>
        </DialogContent>
      </ModalBox>
    </Modal>
  );
}

function toggler({
  text,
  buttonText,
  onClick,
}: {
  text: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <Typography variant="body2">
      {text}
      <Button
        title={buttonText}
        aria-label={buttonText}
        onClick={onClick}
        variant="text"
        color="info"
      >
        {buttonText}
      </Button>
    </Typography>
  );
}

export interface AuthModalProp {
  defaultModal: 'signIn' | 'signUp';
  isOpen: boolean;
  closeModal: () => void;
}
