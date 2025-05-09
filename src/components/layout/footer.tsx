import CopyrightIcon from '@mui/icons-material/Copyright';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack/Stack';
// import { layoutAdminStyle } from 'styles/layout/admin-routes';
// import { layoutPrivateStyle } from 'styles/layout/private-routes';
import { layoutPublicStyle } from '../../styles/layout/public-routes';

const newDate = new Date();

// export function FooterAdminRoutes() {
//   return (
//     <Stack component="footer" sx={layoutAdminStyle.footer}>
//       <Stack direction="row" alignItems="center" gap="5px">
//         <CopyrightIcon sx={{ fontSize: '12px' }} />
//         <Typography sx={{ fontSize: '12px' }}>
//           {newDate.getFullYear()} BINUS Higher Education
//         </Typography>
//       </Stack>
//       <Typography sx={{ fontSize: '12px' }}>BINUSMAYA</Typography>
//     </Stack>
//   );
// }

// export function FooterPrivateRoutes() {
//   return (
//     <Stack component="footer" sx={layoutPrivateStyle.footer}>
//       <Stack sx={layoutPrivateStyle.footerContainer}>
//         <Stack direction="row" alignItems="center" gap="5px">
//           <CopyrightIcon sx={{ fontSize: '12px' }} />
//           <Typography sx={{ fontSize: '12px' }}>
//             {newDate.getFullYear()} BINUS Higher Education
//           </Typography>
//         </Stack>
//         <Typography sx={{ fontSize: '12px' }}>BINUSMAYA</Typography>
//       </Stack>
//     </Stack>
//   );
// }

export function FooterPublicRoutes() {
  return (
    <Stack component="footer" sx={layoutPublicStyle.footer}>
      <Stack direction="column" sx={{ width: { xs: '100%', xl: '1750px' } }}>
        <Typography fontSize={16} marginBottom="10px">
          BINUSMAYA
        </Typography>
        <Typography fontSize={12} marginBottom="35px">
          BINUS Higher Education
        </Typography>
        <Typography fontSize={9}>
          Copyright © 2020-{newDate.getFullYear()} BINUS Higher Education. All rights reserved
        </Typography>
      </Stack>
    </Stack>
  );
}
