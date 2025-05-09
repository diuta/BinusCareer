import { Backdrop } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';

import { FooterPublicRoutes } from '../footer';
import { SideMenuPublicRoute } from '../side-menu';
import { Header } from './header';

export function LayoutPublicRoute({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Header mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      {children}
      {/* <FooterPublicRoutes /> */}
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={mobileMenu}
        onClick={() => setMobileMenu?.(!mobileMenu)}
      >
        <SideMenuPublicRoute mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      </Backdrop>
    </Box>
  );
}

export default LayoutPublicRoute;
