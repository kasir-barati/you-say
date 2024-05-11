import MuiDivider from '@mui/material/Divider';
import { StandardCSSProperties } from '@mui/system/styleFunctionSx';

export function Divider({
  color = '#66788c',
}: Readonly<DividerProps>) {
  return <MuiDivider sx={{ bgcolor: color }} />;
}

interface DividerProps {
  /**
   * @default #66788c Something grayish
   */
  color?: StandardCSSProperties['backgroundColor'];
}
