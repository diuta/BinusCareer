import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import TableClientSide from '../../../components/common/table/TableClientSide';
import { AlumniLog } from '../interface/Alumni';


const getColumns = (): ColumnDef<AlumniLog>[] => [
  {
    accessorKey: 'fieldName',
    header: 'Field Name',
  },
  {
    accessorKey: 'previousData',
    header: 'Previous Data',
  },
  {
    accessorKey: 'updatedData',
    header: 'Updated Data',
  },
  {
    accessorKey: 'updatedTime',
    header: 'Updated Time',
  },
  {
    accessorKey: 'updatedBy',
    header: 'Updated By',
  },
];

export default function AlumniUpdateHistory({
  data,
  open,
  handleClose,
  loading = false,
}: {
  open: boolean;
  handleClose: () => void;
  data: AlumniLog[];
  loading?: boolean;
}) {
  const columns = useMemo(() => getColumns(), []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      sx={{ zIndex: 10 }}
      fullWidth
    >
      <DialogTitle
        id="alert-dialog-title"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        component="div"
        fontWeight="bold"
      >
        <Typography variant="body1" fontWeight={600}>
          View Update History
        </Typography>
        <Box component="div" onClick={handleClose}>
          <Close color="secondary" sx={{ cursor: 'pointer' }} />
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ width: '100%' }}>
        <TableClientSide
          columns={columns}
          data={data}
          initialPageSize={10}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
