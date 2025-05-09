import "air-datepicker/air-datepicker.css";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import AirDatepicker, { AirDatepickerOptions } from "air-datepicker";
import localeEn from "air-datepicker/locale/en";
import { parse } from "date-fns";
import { useEffect, useRef } from "react";

function Datepicker({
  value,
  onChange,
  id,
  name,
  clearIcon = false,
  error = false,
  ...props
}: {
  value: Date | string | null;
  onChange: (e: string | string[]) => void;
  id?: string;
  name?: string;
  clearIcon?: boolean;
  error?: boolean;
} & AirDatepickerOptions) {
  const $input = useRef<HTMLInputElement | null>(null);
  const dp = useRef<AirDatepicker | null>(null);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (dp.current) {
      dp.current.clear();
    }
    onChange("");
  };

  useEffect(() => {
    if ($input.current) {
      dp.current = new AirDatepicker($input.current, {
        locale: localeEn,
        onSelect: (formattedDate) => {
          if ($input.current) {
            onChange(formattedDate.formattedDate);
          }
        },
        ...props,
      });
    }

    return () => {
      if (dp.current) {
        dp.current.destroy();
      }
    };
  }, []);

    useEffect(() => {
        if (dp.current) {
            dp.current.update({ ...props });
        }
    }, [props]);

  useEffect(() => {
    if (dp.current && value) {
      const dateValue =
        props.dateFormat == "dd-MM-yyyy"
          ? parse(String(value), props.dateFormat, new Date())
          : new Date(value);
      dp.current.selectDate(dateValue, { silent: true });
    }
  }, [value]);

  return (
    <FormControl variant="outlined">
      <OutlinedInput
        id={id}
        name={name}
        inputRef={$input}
        value={value ?? ""}
        readOnly
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ marginLeft: value && clearIcon ? "-80px" : "-40px" }}
          >
            {value && clearIcon && (
              <IconButton onClick={handleClear}>
                <ClearIcon sx={{ color: "grey" }} />
              </IconButton>
            )}
            <IconButton
              sx={{
                pointerEvents: "none",
              }}
            >
              <CalendarMonthIcon />
            </IconButton>
          </InputAdornment>
        }
        error={error}
      />
    </FormControl>
  );
}

export default Datepicker;
