import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ModalBox = styled(Box)({
  position: 'absolute',
  top: '20%',
  left: '50%',
  width: '40%',
  transform: 'translate(-50%)',

  border: 'none',
  borderRadius: 8,

  backgroundColor: 'white',
});
