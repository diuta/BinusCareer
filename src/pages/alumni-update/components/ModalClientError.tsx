import {
  Box,
  Button,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import TableClientSide from '../../../components/common/table/TableClientSide';
import { modalAlertStyle } from '../../../styles/common/modal-alert';

function TabPanelApproval(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ backgroundColor: 'white', paddingBottom: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ErrorRow {
  nim: string;
  rowNumber: number;
  errorMessage: string;
}

const columns: ColumnDef<ErrorRow>[] = [
  {
    accessorKey: 'nim',
    header: 'NIM',
  },
  {
    accessorKey: 'rowNumber',
    header: 'Row Number',
  },
  {
    accessorKey: 'errorMessage',
    header: 'Note',
  },
];

interface TabError {
  alive: ErrorRow[];
  passedAway: ErrorRow[];
}

export function ModalClientError({
  data,
  open,
  handleClose,
  title,
  message,
}: {
  data: TabError;
  open: boolean;
  handleClose: () => void;
  title: string;
  message: string;
}) {
  const [tab, setTab] = useState(0);
  return (
    <Modal open={open} onClose={handleClose} sx={modalAlertStyle.modalAlert}>
      <Box
        sx={{
          maxHeight: '80vh',
          overflowY: 'auto',
          ...modalAlertStyle.modalAlertContainer,
          width: '40%',
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
        <Box
          sx={{
            borderBottom: 3,
            borderColor: 'primary.main',
            alignSelf: 'stretch',
            marginTop: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              '& button': {
                marginRight: '1px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
              },
              '& .MuiTab-root': {
                backgroundColor: 'lightgray',
                color: 'black',
              },
              '& .Mui-selected': {
                color: 'white !important',
                backgroundColor: 'primary.main',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab
              label="alive"
              sx={{
                backgroundColor: tab !== 0 ? 'lightgray' : 'primary.main',
                fontSize: '12px',
              }}
            />
            <Tab
              label="passed away"
              sx={{
                backgroundColor: tab !== 1 ? 'lightgray' : 'primary.main',
                fontSize: '12px',
              }}
            />
          </Tabs>
        </Box>
        <Box alignSelf="stretch">
          <TabPanelApproval value={tab} index={0}>
            <TableClientSide
              columns={columns}
              data={data.alive}
              initialPageSize={10}
              maxTableHeight="30vh"
            />
          </TabPanelApproval>
          <TabPanelApproval value={tab} index={1}>
            <TableClientSide
              data={data.passedAway ?? []}
              columns={columns}
              initialPageSize={10}
              maxTableHeight="30vh"
            />
          </TabPanelApproval>
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
