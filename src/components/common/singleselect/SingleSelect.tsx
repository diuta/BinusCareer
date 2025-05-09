import { Autocomplete, Box, MenuItem, TextField, Tooltip } from '@mui/material';
import React, {
  Children,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FixedSizeList } from 'react-window';

import { Option } from '../../../interfaces/ITypes';
import { SingleSelectProps } from './SingleSelectProps';

const CustomListboxComponent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>((props, ref) => {
  const { children, ...other } = props;
  const itemData = Children.toArray(children);
  const itemCount = itemData.length;
  const listHeight = useMemo(() => {
    const numOptions = itemData.length;
    const optionHeight = 36; // Adjust this value based on your option height
    const maxHeight = 300; // Adjust this value for maximum list height
    return Math.min(numOptions * optionHeight, maxHeight);
  }, [itemData]);

  return (
    <Box ref={ref} {...other}>
      <FixedSizeList
        height={listHeight}
        width="100%"
        itemSize={36} // Adjust this value based on your option height
        itemCount={itemCount}
        itemData={itemData}
      >
        {({ index, style }) => <Box style={style}>{itemData[index]}</Box>}
      </FixedSizeList>
    </Box>
  );
});

function SingleSelect({
  data,
  onChange,
  onInputChange,
  value,
  disabled,
  error,
}: SingleSelectProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    if (event && event.target) {
      const syntheticEvent = event as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >;
      onInputChange && onInputChange(syntheticEvent, newInputValue);
    }
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newSelectedOptions: Option | null
  ) => {
    if (newSelectedOptions) {
      setSelectedOption(newSelectedOptions);
      onChange && onChange(newSelectedOptions.value);
    } else {
      setSelectedOption(null);
      onChange && onChange(null);
    }
  };
  useEffect(() => {
    setSelectedOption(
      data.find((option: Option) => option.value === value) || null
    );
  }, [value, data]);

  return (
    <Autocomplete
      disabled={disabled}
      options={data}
      value={selectedOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option: Option, value_: Option) =>
        option.value === value_.value
      }
      getOptionLabel={(option: Option) => option.label}
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Type to search..."
          inputProps={{
            style: { border: 'none', fontSize: '14px !important' },
            ...params.inputProps,
          }}
          error={error}
        />
      )}
      ListboxComponent={CustomListboxComponent}
      renderOption={(props, option: Option, { selected }) => (
        <Tooltip title={option.description} followCursor>
          <MenuItem
            {...props}
            sx={{
              fontSize: '14px',
              backgroundColor: selected ? '#FCEDD7' : 'white',
              '&:hover': {
                backgroundColor: selected ? '#FDF3E6' : '#0000000a',
              },
            }}
          >
            {option.label}
          </MenuItem>
        </Tooltip>
      )}
      componentsProps={{
        paper: { sx: { width: 'calc(100% + 16px)', ml: '-8px', mr: '-8px' } },
      }}
      sx={{
        "& button[title='Clear']": {
          visibility: 'visible',
        },
        padding: '0 !important',
        backgroundColor: error ? '#FFDBD9' : '',
      }}
    />
  );
}

export default React.memo(SingleSelect);
