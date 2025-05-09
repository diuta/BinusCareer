import { Box, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import PageWrapper from '../../components/container/PageWrapper';
import AliveTable from './components/alumni_approval/AliveTable';
import PassedAwayTable from './components/alumni_approval/PassedAwayTable';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../store/profile/selector';

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

export function Approval() {
  const { rolePermissions } = useSelector(selectProfile);
  const hasPermission = rolePermissions.some(
    item => item.permissionName === 'approval-update-data'
  );

  const [sectionActivefilter, setSectionActiveFilter] = useState('');
  const [sectionHistoryfilter, setSectionHistoryfilter] = useState('');

  const [activeTab, setActiveTab] = useState(0);
  const [historyTab, setHistoryTab] = useState(0);

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, set) => {
      const searchTerm = e.target.value.toLowerCase();
      set(searchTerm);
    },
    1000
  );

  return (
    <PageWrapper>
      <Box component="section" marginBottom={6}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={1}
        >
          <Typography variant="body1" marginBottom={0}>
            Active
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            gap={1}
          >
            <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
              Search:
            </Typography>
            <TextField
              id="Search By"
              onChange={event => handleSearch(event, setSectionActiveFilter)}
            />
          </Stack>
        </Stack>

        <Box>
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
                label="alive"
                sx={{
                  backgroundColor:
                    activeTab !== 0 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
              <Tab
                label="passed away"
                sx={{
                  backgroundColor:
                    activeTab !== 1 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
            </Tabs>
          </Box>
          <TabPanelApproval value={activeTab} index={0}>
            <AliveTable
              filter={sectionActivefilter}
              isActive
              hasPermission={hasPermission}
            />
          </TabPanelApproval>
          <TabPanelApproval value={activeTab} index={1}>
            <PassedAwayTable
              filter={sectionActivefilter}
              isActive
              hasPermission={hasPermission}
            />
          </TabPanelApproval>
        </Box>
      </Box>

      <Box component="section" marginBottom={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={1}
        >
          <Typography variant="body1" marginBottom={0}>
            History
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            gap={1}
          >
            <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
              Search:
            </Typography>
            <TextField
              id="Search By"
              onChange={event => handleSearch(event, setSectionHistoryfilter)}
              size="small"
            />
          </Stack>
        </Stack>

        <Box>
          <Box sx={{ borderBottom: 3, borderColor: 'primary.main' }}>
            <Tabs
              value={historyTab}
              onChange={(_, value) => setHistoryTab(value)}
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
                  backgroundColor:
                    historyTab !== 0 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
              <Tab
                label="passed away"
                sx={{
                  backgroundColor:
                    historyTab !== 1 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
            </Tabs>
          </Box>
          <TabPanelApproval value={historyTab} index={0}>
            <AliveTable filter={sectionHistoryfilter} />
          </TabPanelApproval>
          <TabPanelApproval value={historyTab} index={1}>
            <PassedAwayTable filter={sectionHistoryfilter} />
          </TabPanelApproval>
        </Box>
      </Box>
    </PageWrapper>
  );
}
