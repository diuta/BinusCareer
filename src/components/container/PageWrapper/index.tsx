import PropTypes from 'prop-types';
import { ReactNode } from 'react'; // Ensure ReactNode is imported
import { Stack } from '@mui/material';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <Stack sx={{ padding: "15px", height:"auto", overflow: 'auto', width: '100%', overflowX:'hidden' }}>
      {children}
    </Stack>
  );
}
