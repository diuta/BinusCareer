import { 
  Divider,
  Typography,
} from '@mui/material';

import PageWrapper from '../../components/container/PageWrapper';
import { ApprovalEndowmentHistoryTable } from './components/ApprovalEndowmentHistoryTable';
import { ApprovalEndowmentTable } from './components/ApprovalEndowmentTable';

export function ApprovalEndowment() {
  return (
    <PageWrapper>
      <Typography sx={{marginLeft:'20px', fontSize:"20px", fontWeight:400}}>Active</Typography>
      <ApprovalEndowmentTable/>
      <Divider sx={{marginY: "20px"}}/>
      <Typography sx={{marginLeft:'20px', fontSize:"20px", fontWeight:400}}>History</Typography>
      <ApprovalEndowmentHistoryTable/>
    </PageWrapper>
  );
}


ApprovalEndowment.propTypes = null;