import { Autocomplete, Box, Chip, MenuItem, TextField, Tooltip } from '@mui/material';
import { Children, forwardRef,useEffect,useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { Option } from '../../../interfaces/ITypes';
import { MultiSelectProps } from './MultiSelectProps';

const CustomListboxComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
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
          {({ index, style }) => (
            <Box style={style}>
              {itemData[index]}
            </Box>
          )}
      </FixedSizeList>
    </Box>
  );
  }
);

function MultiSelect({
  data,
  onChange,
  onInputChange,
  value,
}: MultiSelectProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: string,
  ) => {
    if (event && event.target) {
      const syntheticEvent = event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      onInputChange && onInputChange(syntheticEvent, newInputValue);
    }
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newSelectedOptions: Option[],
  ) => {
    setSelectedOptions(newSelectedOptions);
    const newSelectedOptionValues = newSelectedOptions.map((option) => option.value);
    onChange && onChange(newSelectedOptionValues);
  };

  useEffect(() => {
    setSelectedOptions(selectedOption =>
      selectedOption.filter(option => value?.includes(option.value))
    );
  }, [value]);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={data}
      value={selectedOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option: Option, value_: Option) =>
        option.value === value_.value
      }
      getOptionLabel={(option: Option) => option.label}
      renderInput={params => (
        <TextField
          {...params}
          placeholder='Type to search...'
          inputProps={{style: { border: 'none'},  ...params.inputProps}}
        />
      )}
      ListboxComponent={CustomListboxComponent}
      renderTags={(value_, getTagProps) => {
        const tagsCount = value_.length;
        const LIMIT = 2;
        return (
          <>
            {value_.slice(0, LIMIT).map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  variant="outlined"
                  label={option.label}
                  sx={{
                    maxWidth: '25%',
                    cursor: 'default',
                    paddingRight: '5px',
                    '&:hover': { backgroundColor: '#0000000a', },
                    '& svg': {
                      color: '#999',
                      '&:hover': { cursor: 'pointer', color: '#333' }
                    }
                  }}
                  {...tagProps}
                />
              );
            })}
            { tagsCount > LIMIT && ` +${tagsCount - LIMIT}`}
          </>
        );
      }
      }
      renderOption={(props, option: Option, { selected }) => (
        <Tooltip title={option.description} followCursor>
          <MenuItem
            {...props}
            sx={{
              backgroundColor: selected ? '#FCEDD7' : 'white',
              '&:hover': { backgroundColor: selected ? '#FDF3E6' : '#0000000a' }

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
        "& button[title='Clear']" : {
          visibility: "visible"
        }
      }}
    />
  );
}

export default MultiSelect;