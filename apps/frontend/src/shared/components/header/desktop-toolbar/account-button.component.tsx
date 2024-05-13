'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import Link from 'next/link';
import { useModal } from '../../../hooks/use-modal.hook';
import { CountDown } from '../../countdown/countdown.component';
import { Divider } from '../../divider/divider.component';
import { ShopButton } from '../../shop-button/shop-button.component';
import { SingOutButton } from '../../sign-out-button/sign-out.component';
import { ModalBox } from '../modal-box.component';

const containerGrid2Sx = {
  width: '100%',
  padding: 2,
  border: 1,
  borderRadius: 4,
  borderStyle: 'solid',
  borderColor: '#66788c',
  marginY: '24px !important',
};
const countDownGrid2Sx = {
  'display': 'flex',
  'textAlign': 'right',
  'justifyContent': 'right',
  '& .MuiBox-root': {
    alignItems: 'end',
  },
};

export function AccountButton() {
  const { userInfo } = useFusionAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const avatarAlt = userInfo?.given_name ?? 'Avatar';
  const avatarUrl = userInfo?.picture;
  const name = userInfo?.family_name ?? 'Family';
  const email = userInfo?.email ?? 'email@example.com';
  // TODO: https://github.com/FusionAuth/fusionauth-javascript-sdk/issues/94
  const username = 'userInfo?.preferred_username';
  // TODO: fetch countdown data in quests collection!
  const handleComplete = () => {
    console.log('');
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={openModal}>
        Account
      </Button>
      <Modal open={isOpen} onClose={closeModal}>
        <ModalBox bgcolor="white">
          <DialogTitle
            component="div"
            justifyContent="space-between"
            display="flex"
          >
            <span />
            <IconButton
              data-test="account-modal-close-button"
              onClick={closeModal}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Stack display="flex" alignItems="center">
              <Avatar
                sx={{ bgcolor: '#010023' }}
                alt={avatarAlt}
                src={avatarUrl}
              >
                {avatarAlt[0]}
              </Avatar>
              <Typography variant="h4" color="black">
                Your account
              </Typography>
              <Grid2 container sx={containerGrid2Sx} gap={2}>
                <Grid2 container xs={12} alignItems="center">
                  <Grid2 xs textAlign="left">
                    <Typography color="black">{name}</Typography>
                    <Typography color="gray">{email}</Typography>
                  </Grid2>
                  <Grid2 xs textAlign="right">
                    <MuiLink
                      component={Link}
                      href={`/profile/${username}/edit`}
                      underline="none"
                    >
                      Edit
                    </MuiLink>
                  </Grid2>
                </Grid2>
                <Grid2 xs={12}>
                  <Divider />
                </Grid2>
                <Grid2 container xs={12} alignItems="center">
                  <Grid2 xs textAlign="left">
                    <Typography color="black">
                      QuestName with the least time left
                    </Typography>
                  </Grid2>
                  <Grid2 xs sx={countDownGrid2Sx}>
                    <CountDown
                      duration={40}
                      countdownCurrentPercentage={70}
                      onComplete={handleComplete}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
              <Box
                justifyContent="space-between"
                display="flex"
                width="100%"
              >
                <SingOutButton />
                <ShopButton />
              </Box>
            </Stack>
          </DialogContent>
        </ModalBox>
      </Modal>
    </>
  );
}
