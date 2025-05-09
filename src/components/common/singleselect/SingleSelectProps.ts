import { SelectProps } from '@mui/material';

import { Option } from '../../../interfaces/ITypes';

export type SingleSelectProps = SelectProps<string> & {
  data: Option[];
  value?: string;
  onChange?: (value: string | null) => void;
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    newInputValue: string
  ) => void;
  onClear?: (value: string) => void;
  children?: React.ReactNode | React.ReactNode[];
};
