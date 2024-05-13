import TextField, { TextFieldProps } from '@mui/material/TextField';

const WhiteInputLabelProps = {
  style: { color: 'white' },
};
const whiteTextFieldSx = {
  '& .MuiOutlinedInput-root': {
    '&.MuiInputBase-root fieldset': {
      borderColor: 'white',
    },
  },
};
const whiteInputProps = {
  sx: {
    '&::placeholder': {
      color: 'white',
      opacity: 1, // otherwise firefox shows a lighter color
    },
    'color': 'white',
  },
};

export function WhiteTextField({
  sx,
  inputProps,
  InputLabelProps,
  ...props
}: TextFieldProps) {
  return (
    <TextField
      {...props}
      sx={{ ...sx, ...whiteTextFieldSx }}
      inputProps={{ ...inputProps, ...whiteInputProps }}
      InputLabelProps={{
        ...InputLabelProps,
        ...WhiteInputLabelProps,
      }}
    />
  );
}
