/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Backdrop } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { layoutPrivateStyle } from '../../../styles/layout/private-routes';
// import { ProfileMenuProps } from '../../../types/modul-login';
// import { callMsGraph } from 'utils/graph';
import { ModulProfileMenu } from './modul-profile-menu';


export function Header({toggleSideMenu}) {
  const [profileMenu, setProfileMenu] = useState(false);

  return (
    <Stack component="header" sx={layoutPrivateStyle.header}>
      <Stack sx={layoutPrivateStyle.headerContainer}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{ gap: { xs: '10px', sm: '16px' } }}
        >
          <Box
            component="img"
            src="/assets/icon/semesta.svg"
            onClick={() => {toggleSideMenu()}}
            sx={layoutPrivateStyle.headerIcon}
          />
          <Link href="/home" sx={{ display: { xs: 'none', sm: 'flex', alignSelf: 'center' } }}>
            <Box
              component="img"
              src="/assets/logo/Logo-BINUS-Alumni.png"
              sx={layoutPrivateStyle.headerImg}
            />
          </Link>
          <Box sx={layoutPrivateStyle.headerDivider} />
          <Link href="/home" underline="none" textTransform="none">
            <Typography sx={layoutPrivateStyle.headerTypography}>Alumni Dashboard</Typography>
          </Link>
        </Box>

        <Stack direction="row" alignItems="center" gap="16px">
          <Avatar
            sx={layoutPrivateStyle.headerAvatar}
            onClick={() => setProfileMenu?.(!profileMenu)}
          />
        </Stack>
        <Backdrop
          sx={{ background: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={profileMenu}
          onClick={() => setProfileMenu?.(!profileMenu)}
        >
          <Box
            sx={{
              width: { xs: '100%', xl: '100%' },
              height: '100vh',
              position: 'relative',
            }}
          >
            <ModulProfileMenu profileMenu={profileMenu} setProfileMenu={setProfileMenu} />
          </Box>
        </Backdrop>
      </Stack>
    </Stack>
  );
}

Header.propTypes = null;