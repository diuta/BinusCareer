import { Dispatch, SetStateAction } from 'react';
import { OrganizationRole } from '../store/profile/types';

export type ModalChangeRolesProps = {
  modalChangeRoles?: boolean;
  setModalChangeRoles?: Dispatch<SetStateAction<boolean>>;
  organizationRoles?: OrganizationRole[];
};
