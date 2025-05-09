import { Height } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

// HEADER

const headerImgPitaBiru: SxProps<Theme> = {
  marginLeft: { xs: '8px', md: '16px' },
  width: '42px',
  height: { xs: '60px', sm: '77px' },
};

const headerImgLogoBinus: SxProps<Theme> = {
  marginTop: { xs: '15px', sm: '20px' },
  marginLeft: { xs: '10px', sm: '16px' },
  width: { xs: '120px', sm: 'auto' },
  height: { xs: '70px', sm: 'auto' },
  maxHeight: '80px',
};

const headerImgLogoBinusAlumni: SxProps<Theme> = {
  marginTop: { xs: '65px', sm: '80px' },
  marginLeft: { xs: '10px', sm: '16px' },
  width: { xs: '145px', sm: 'auto' },
  height: { xs: '25px', sm: 'auto' },
  maxHeight: '20px',
};

const headerBox: SxProps<Theme> = {
  display: 'flex',
  alignItems: { xs: 'center', md: 'end' },
  justifyContent: 'end',
  marginRight: '8px',
};

const headerBoxLink: SxProps<Theme> = {
  marginRight: '36px',
  marginBottom: '15px',
  display: { xs: 'none', md: 'block' },
  color: '#2f4f4f',
  ':hover': { color: 'grey' },
};

const headerBoxLinkTypography: SxProps<Theme> = {
  fontFamily: 'Open Sans,sans-serif',
  fontSize: '14px',
  fontWeight: 700,
};

const headerBoxIcon: SxProps<Theme> = {
  position: 'relative',
  fontSize: { xs: '30px', sm: '40px' },
  display: { xs: 'blovk', md: 'none' },
  cursor: 'pointer',
};

// OVERLAY

const overlay: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,.6784313725490196)',
  position: 'fixed',
  top: 0,
  left: 0,
  display: { xs: 'block', md: 'none' },
};

// SIDE MENU

const sideMenu: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  right: 0,
  height: 0,
  display: { xs: 'block', md: 'none' },
};

const sideMenuPaperBox: SxProps<Theme> = {
  width: { xs: '250px', sm: '315px' },
  padding: '20px',
  height: '100vh',
  background: '#fffff',
};

const sideMenuBoxIcon: SxProps<Theme> = {
  mwidth: '100%',
  height: 'auto',
  display: 'flex',
  justifyContent: 'end',
};

const sideMenuIcon: SxProps<Theme> = {
  fontSize: { xs: '24px', sm: '32px' },
  cursor: 'pointer',
};

const sideMenuBoxLink: SxProps<Theme> = {
  mwidth: '100%',
  height: 'auto',
  display: 'flex',
  justifyContent: 'start',
};

const sideMenuLink: SxProps<Theme> = {
  marginRight: '36px',
  marginBottom: '15px',
  color: '#2f4f4f',
  ':hover': { color: 'grey' },
};

const sideMenuLinkTypography: SxProps<Theme> = {
  fontFamily: 'Open Sans,sans-serif',
  fontSize: { xs: '18px', sm: '22px' },
  fontWeight: 700,
};

// FOOTER

const footer: SxProps<Theme> = {
  width: '100%',
  height: '18%',
  minHeight: '140px',
  backgroundColor: '#484040',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  padding: '20px',
  color: '#fff',
  fontFamily: '"Open Sans",sans-serif !important',
};

export const layoutPublicStyle = {
  headerImgPitaBiru,
  headerImgLogoBinus,
  headerImgLogoBinusAlumni,
  headerBox,
  headerBoxLink,
  headerBoxLinkTypography,
  headerBoxIcon,
  overlay,
  sideMenu,
  sideMenuPaperBox,
  sideMenuBoxIcon,
  sideMenuIcon,
  sideMenuBoxLink,
  sideMenuLink,
  sideMenuLinkTypography,
  footer,
};
