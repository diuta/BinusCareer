import { SelectProps } from "@mui/material";
import { Option } from "../../../interfaces/ITypes";

export type MultiSelectProps = SelectProps<string[]> & {
  data: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    newInputValue: string,
  ) => void;
  onClear?: (value: string[]) => void;
  children?: React.ReactNode | React.ReactNode[];
};
