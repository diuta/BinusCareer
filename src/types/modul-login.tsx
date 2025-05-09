import { Dispatch, SetStateAction } from 'react';

export type ProfileMenuProps = {
  profileMenu?: boolean;
  setProfileMenu?: Dispatch<SetStateAction<boolean>>;
};

export type PresetMenuProps = {
  openPreset?: boolean;
  setOpenPreset?: Dispatch<SetStateAction<boolean>>;
};
