import { 
  Divider,
  Typography,
} from '@mui/material';

import PageWrapper from '../../components/container/PageWrapper';
import { ApprovalEngagementHistoryTable } from './components/ApprovalEngagementHistoryTable';
import { ApprovalEngagementTable } from './components/ApprovalEngagementTable';

export function ApprovalEngagement() {
  return (
    <PageWrapper>
      <Typography sx={{marginLeft:'20px', fontSize:'20px', fontWeight:400}}>Active</Typography>
      <ApprovalEngagementTable/>
      <Divider sx={{marginY: "20px"}}/>
      <Typography sx={{marginLeft:'20px', fontSize:'20px', fontWeight:400}}>History</Typography>
      <ApprovalEngagementHistoryTable/>
    </PageWrapper>
  );
}


ApprovalEngagement.propTypes = null;