import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20%',
  left: '50%',
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
  width: '95%',
  transform: 'translate(-50%)',

  border: 'none',
  borderRadius: 8,

  backgroundColor: 'white',
}));
