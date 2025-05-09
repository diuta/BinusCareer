import { SelectProps } from "@mui/material";

import { Option } from "../../../interfaces/ITypes";

export type OldMultiSelectProps = SelectProps<string[]> & {
  data: Option[];
  value: string[];
  onClear: () => void;
  children: React.ReactNode | React.ReactNode[];
  emptySelectionText?: boolean;
};
