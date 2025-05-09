import { Dispatch, SetStateAction } from 'react';

export type ModalLoginProps = {
  modalLogin?: boolean;
  setModalLogin?: Dispatch<SetStateAction<boolean>>;
};
