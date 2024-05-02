import MuiSearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useModal } from '../../hooks/use-modal.hook';
import { ModalBox } from './modal-box.component';

const textFieldStyle = {
  '& fieldset': {
    border: 'none',
  },
};

export function SearchModal() {
  const { isOpen, openModal, closeModal } = useModal();
  // Make sure considering https://mui.com/material-ui/react-autocomplete/#controlled-states warning
  const options = ['some', 'dummy', 'values'];

  return (
    <>
      <IconButton data-test="search-icon-button" onClick={openModal}>
        <MuiSearchIcon htmlColor="white" />
      </IconButton>
      <Modal open={isOpen} onClose={closeModal}>
        <ModalBox>
          <Autocomplete
            freeSolo
            options={options}
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search posts, tags, and authors"
                sx={textFieldStyle}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MuiSearchIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={params.inputProps}
              />
            )}
          />
        </ModalBox>
      </Modal>
    </>
  );
}
