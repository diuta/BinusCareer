import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { useMemo, useState } from 'react';

import TableClientSide from '../../../components/common/table/TableClientSide';
import { Child, ChildLog } from '../interface/Child';

const getPreviousColumns = (): ColumnDef<Child>[] => [
  {
    accessorKey: 'alumniChildName',
    header: 'Name',
  },
  {
    accessorKey: 'alumniChildDateBirth',
    header: 'Date of Birth',
    cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy'),
  },
  {
    accessorKey: 'alumniChildGenderId',
    header: 'Gender',
  },
  {
    accessorKey: 'alumniChildCountryId',
    header: 'Country',
  },
];

const getUpdatedColumns = (mapped: {
  [key: string]: string;
}): ColumnDef<Child>[] => [
  {
    accessorKey: 'alumniChildName',
    header: 'Name',
    cell: info => {
      const { alumniChildId } = info.row.original;

      const isUpdated = mapped[alumniChildId]?.includes('AlumniChildName');

      return (
        <Typography variant="label" color={isUpdated ? 'warning.main' : ''}>
          {info.getValue() as string}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'alumniChildDateBirth',
    header: 'Date of Birth',
    cell: info => {
      const { alumniChildId } = info.row.original;

      const isUpdated = mapped[alumniChildId]?.includes('AlumniChildDateBirth');

      const value = formatDate(info.getValue() as string, 'd MMMM yyyy');

      return (
        <Typography variant="label" color={isUpdated ? 'warning.main' : ''}>
          {value}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'alumniChildGenderId',
    header: 'Gender',
    cell: info => {
      const { alumniChildId } = info.row.original;

      const isUpdated = mapped[alumniChildId]?.includes('AlumniChildGenderId');

      return (
        <Typography variant="label" color={isUpdated ? 'warning.main' : ''}>
          {info.getValue() as string}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'alumniChildCountryId',
    header: 'Country',
    cell: info => {
      const { alumniChildId } = info.row.original;

      const isUpdated = mapped[alumniChildId]?.includes('AlumniChildCountryId');

      return (
        <Typography variant="label" color={isUpdated ? 'warning.main' : ''}>
          {info.getValue() as string}
        </Typography>
      );
    },
  },
];

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
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function AlumniUpdateChildHistory({
  data,
  open,
  handleClose,
  loading,
}: {
  open: boolean;
  handleClose: () => void;
  data: ChildLog[];
  loading: boolean;
}) {
  // Extract data for the tables
  const previousData = data.map(log => log.previous).filter(t => t !== null);
  const updatedData = data.map(log => log.updated).filter(t => t !== null);

  const mapped = data.reduce((acc, log) => {
    acc[log.childId] = log.changedFieldName;
    return acc;
  }, {});

  const previousColumn = useMemo(() => getPreviousColumns(), []);
  const updatedColumn = useMemo(() => getUpdatedColumns(mapped), [mapped]);
  const [activeTab, setActiveTab] = useState(0);

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
      >
        <Typography variant="body1" fontWeight={600}>
          View Update Child
        </Typography>
        <Box component="div" onClick={handleClose}>
          <Close color="secondary" />
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ width: '100%' }}>
        <Box component="section" marginBottom={6}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 3, borderColor: 'primary.main' }}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
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
                  label="Previous"
                  sx={{
                    backgroundColor:
                      activeTab !== 0 ? 'lightgray' : 'primary.main',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
                <Tab
                  label="Updated"
                  sx={{
                    backgroundColor:
                      activeTab !== 1 ? 'lightgray' : 'primary.main',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
              </Tabs>
            </Box>
            <TabPanelApproval value={activeTab} index={0}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  border: 2,
                  borderTop: 0,
                  borderColor: 'lightgray',
                  padding: 3,
                }}
              >
                <TableClientSide
                  columns={previousColumn}
                  data={previousData}
                  initialPageSize={10}
                  pageSizeOptions={[10, 20, 50]}
                  loading={loading}
                />
              </Box>
            </TabPanelApproval>
            <TabPanelApproval value={activeTab} index={1}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  border: 2,
                  borderTop: 0,
                  borderColor: 'lightgray',
                  padding: 3,
                }}
              >
                <TableClientSide
                  columns={updatedColumn}
                  data={updatedData}
                  initialPageSize={10}
                  pageSizeOptions={[10, 20, 50]}
                  loading={loading}
                />
              </Box>
            </TabPanelApproval>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
