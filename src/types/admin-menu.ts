import { Dispatch, SetStateAction } from 'react';

export type AdminMenuProps = {
  adminMenu?: boolean;
  setAdminMenu?: Dispatch<SetStateAction<boolean>>;
  modulOpen?: boolean;
  activeMenu?: string;
  setActiveMenu?: Dispatch<SetStateAction<string>>;
  isSmall?: boolean;
};
