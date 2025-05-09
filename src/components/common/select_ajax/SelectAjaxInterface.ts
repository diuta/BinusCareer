import { MasterDropdownReturn, Option } from "../../../interfaces/ITypes";

type SelectType = 'single' | 'multiple';

export interface SelectAjaxProps {
  name: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  apiEndpoint: string;
  dataTransform?: (data: MasterDropdownReturn) => Option[];
  selectType: SelectType;
  setOptionsRef?: (setOptions: React.Dispatch<React.SetStateAction<Option[]>>) => void;
  disabled?: boolean;
  error?: boolean;
}
