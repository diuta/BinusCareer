import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, InputAdornment, Select, Typography } from '@mui/material';

import { OldMultiSelectProps } from './OldMultiSelectProps';

export default function OldMultiSelect({
  children,
  data,
  onClear,
  onChange,
  emptySelectionText = false,
  ...props
}: OldMultiSelectProps) {
  return (
    <Select
      endAdornment={
        props.value.length > 0 && (
          <InputAdornment
            position="end"
            sx={{ position: 'absolute', right: '25px' }}
          >
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                onClear();
              }}
            >
              <ClearIcon sx={{ color: 'grey' }} />
            </IconButton>
          </InputAdornment>
        )
      }
      multiple
      displayEmpty
      onChange={onChange}
      renderValue={(selected: string[]) => {
        const MIN_OPTION_LENGTH = 2;
        const TEXT_ALL = 'All';
        const TEXT_NO_DATA = 'No Data Selected';
        const displayDefault = emptySelectionText ? TEXT_NO_DATA : TEXT_ALL;
        const displayAll = selected.length === data.length && data.length > MIN_OPTION_LENGTH;

        if (selected.length === 0 ) {
          return <Typography sx={{fontSize: 14}}>{displayDefault}</Typography>;
        }
        if(displayAll){
          return <Typography sx={{fontSize: 14}}>{TEXT_ALL}</Typography>;
        }

        const displayValue = data
          .filter(item => selected.includes(item.value))
          .map(item => item.label)
          .join(', ');

        return (
          <Typography sx={{ paddingRight: '40px', fontSize: 14 }} noWrap>
            {displayValue}
          </Typography>
        );
      }}
      {...props}
    >
      {children}
    </Select>
  );
}
