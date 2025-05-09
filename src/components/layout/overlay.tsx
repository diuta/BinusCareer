import Box from '@mui/material/Box/Box';
import { layoutPrivateStyle } from '../../styles/layout/private-routes';
import { ModalChangeRolesProps } from '../../types/modal-change-roles';
import { ModalLoginProps } from '../../types/modal-login';

export function OverlayModalLogin({ modalLogin, setModalLogin }: ModalLoginProps) {
  return (
    <Box
      sx={modalLogin ? layoutPrivateStyle.overlay : { display: 'none' }}
      onClick={() => setModalLogin?.(!modalLogin)}
    />
  );
}

export function OverlayAzure({ overlay }: { overlay: boolean }) {
  return <Box sx={overlay ? layoutPrivateStyle.overlay : { display: 'none' }} />;
}

export function OverlayChangeRole({
  modalChangeRoles,
  setModalChangeRoles,
}: ModalChangeRolesProps) {
  return (
    <Box
      sx={modalChangeRoles ? layoutPrivateStyle.overlay : { display: 'none' }}
      onClick={() => setModalChangeRoles?.(!modalChangeRoles)}
    />
  );
}
