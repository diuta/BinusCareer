import 'air-datepicker/air-datepicker.css';

import { Clear as ClearIcon } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import React, { useEffect, useRef } from 'react';

interface RangeDatepickerProps {
  value: number[];
  onChange: (value: number[]) => void;
  id?: string;
  clearIcon?: boolean;
  error?: boolean;
}
function RangeYearpicker({
  value,
  onChange,
  clearIcon = false,
  id,
  error,
}: RangeDatepickerProps) {
  const $input = useRef<HTMLInputElement | null>(null);
  const dp = useRef<AirDatepicker | null>(null);
  const selectedDates = useRef<Date[]>([]);

  // Handle clear action
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (dp.current) {
      dp.current.clear();
    }
    onChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if ($input.current) {
      dp.current = new AirDatepicker($input.current, {
        locale: localeEn,
        view: 'years',
        minView: 'years',
        range: true,
        multipleDatesSeparator: ' - ',
        disableNavWhenOutOfRange: true,
        dateFormat: date => date.getFullYear().toString(),
        onSelect: ({ date }) => {
          selectedDates.current = Array.isArray(date) ? date : [date];

          if (selectedDates.current.length >= 2) {
            dp.current?.hide();
          }
        },
        onHide: () => {
          if (selectedDates.current.length > 0) {
            const [startDate, endDate] = selectedDates.current;

            if (startDate && !endDate) {
              onChange([startDate.getFullYear()]);
            } else if (startDate && endDate) {
              onChange([startDate.getFullYear(), endDate.getFullYear()]);
            }
          }
        },
      });
    }

    return () => {
      if (dp.current) {
        dp.current.destroy();
      }
    };
  }, [onChange]);

  const formattedValue =
    value && value.length === 2
      ? `${value[0]} - ${value[1]}`
      : value && value.length === 1
      ? `${value[0]}`
      : '';

  return (
    <FormControl variant="outlined">
      <OutlinedInput
        id={id}
        value={formattedValue}
        readOnly
        onKeyDown={handleKeyDown}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ marginLeft: value?.length && clearIcon ? '-80px' : '-40px' }}
          >
            {value.length > 0 && clearIcon && (
              <IconButton onClick={handleClear}>
                <ClearIcon sx={{ color: 'grey' }} />
              </IconButton>
            )}
            <IconButton
              sx={{
                pointerEvents: 'none',
              }}
            >
              <CalendarMonthIcon />
            </IconButton>
          </InputAdornment>
        }
        error={error}
        inputRef={$input} // Connect the input ref to the AirDatepicker instance
      />
    </FormControl>
  );
}

export default React.memo(RangeYearpicker);
