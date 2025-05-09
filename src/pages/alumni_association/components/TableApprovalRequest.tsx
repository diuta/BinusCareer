import { 
    Box,
    Stack,
    Tab,    Tabs,
    TextField,
    Typography} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import AddRequestTable from './TableApprovalRequestAdd';
import EditRequestTable from './TableApprovalRequestEdit';

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


export default function RequestTable() {
  const [type,setType] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [set, reset] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: 10, 
  }); 

  const handleSearch =  useDebouncedCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearchValue(searchTerm);
		reset(!set);
  }, 1000);

  return (
    <Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h6'>Active</Typography>
        <Stack direction='row' alignItems='center' gap='10px'>
          <Typography>Search:</Typography>
          <TextField variant='outlined' placeholder='Search By' onChange={handleSearch}/>
        </Stack>
      </Stack>

      <Box sx={{ borderBottom: 3, borderColor: 'primary.main' }}>
            <Tabs
              value={type}
              onChange={(_, value) => setType(value)}
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
                label="add data"
                sx={{
                  backgroundColor:
                    type !== 0 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
              <Tab
                label="edit data"
                sx={{
                  backgroundColor:
                  type !== 1 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
            </Tabs>
          </Box>

          <TabPanelApproval value={type} index={0}>
            <AddRequestTable
            searchValue={searchValue} 
            set = {set}
            reset = {reset}
            pagination = {pagination}
            setPagination = {setPagination}
            dataWatcher = {dataWatcher}
            />
          </TabPanelApproval>
          <TabPanelApproval value={type} index={1}>
            <EditRequestTable
              searchValue={searchValue}
              set = {set}
              reset = {reset}
              pagination = {pagination}
              setPagination = {setPagination}
              dataWatcher = {dataWatcher}
            />
          </TabPanelApproval>
          
    </Stack>
  );
}

