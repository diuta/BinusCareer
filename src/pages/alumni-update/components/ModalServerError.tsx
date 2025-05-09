import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';

import TableClientSide from '../../../components/common/table/TableClientSide';
import { modalAlertStyle } from '../../../styles/common/modal-alert';

interface ErrorRow {
  nim: string;
  errorMessage: string;
}

const columns: ColumnDef<ErrorRow>[] = [
  {
    accessorKey: 'nim',
    header: 'NIM',
  },
  {
    accessorKey: 'errorMessage',
    header: 'Note',
  },
];

export function ModalServerError({
  data,
  open,
  handleClose,
  title,
  message,
}: {
  data: ErrorRow[];
  open: boolean;
  handleClose: () => void;
  title: string;
  message: string;
}) {
  return (
    <Modal open={open} onClose={handleClose} sx={modalAlertStyle.modalAlert}>
      <Box
        sx={{
          maxHeight: '80vh',
          overflowY: 'auto',
          ...modalAlertStyle.modalAlertContainer,
          width: { xl: '40%', sm: '90%' },
        }}
      >
        <Box
          component="img"
          src="/assets/alert/ilustrasi-cody-failed.png"
          sx={modalAlertStyle.modalAlertLogo}
        />
        <Stack sx={modalAlertStyle.modalAlertContent}>
          <Typography sx={modalAlertStyle.modalAlertTitle}>{title}</Typography>
          <Typography sx={modalAlertStyle.modalAlertDesc}>{message}</Typography>
        </Stack>

        <Box alignSelf="stretch">
          <TableClientSide
            columns={columns}
            data={data}
            initialPageSize={10}
            maxTableHeight="30vh"
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={modalAlertStyle.modalAlertButton}
          onClick={handleClose}
        >
          Ok
        </Button>
      </Box>
    </Modal>
  );
}
