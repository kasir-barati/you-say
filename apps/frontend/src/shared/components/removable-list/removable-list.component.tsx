'use client';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export function RemovableList({
  values,
  onRemove,
}: Readonly<RemovableListProps>) {
  return (
    <List sx={{ display: 'flex' }}>
      {values.map((value) => (
        <ListItem
          key={value}
          sx={{
            width: 'fit-content',
            bgcolor: '#01002311',
            marginRight: 1,
            borderRadius: 100,
          }}
          secondaryAction={
            <IconButton
              disableRipple
              disableFocusRipple
              disableTouchRipple
              aria-label={`Remove ${value}`}
              onClick={() => onRemove(value)}
            >
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          }
        >
          <ListItemText primary={value} />
        </ListItem>
      ))}
    </List>
  );
}

export interface RemovableListProps {
  values: string[];
  onRemove: (value: string) => void;
}
