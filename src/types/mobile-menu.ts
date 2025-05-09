import { Dispatch, SetStateAction } from 'react';

import { ModalChangeRolesProps } from './modal-change-roles';

export type MobileMenuProps = {
  mobileMenu?: boolean;
  setMobileMenu?: Dispatch<SetStateAction<boolean>>;
} & ModalChangeRolesProps;
