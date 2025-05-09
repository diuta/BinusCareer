import { SxStyle } from '../../types/style';

// WIDGET
const widgetBoxOnEditMode: SxStyle = {
  opacity: 0.6,
  ':hover': {
    opacity: 1,
  },
};

const widgetBoxTitle: SxStyle = {
  fontSize: 16,
  fontWeight: 500,
  marginBottom: '8px',
};

const widgetBoxCard: SxStyle = {
  position: 'relative',
  bgcolor: '#fff',
  height: '94%',
  border: '1px solid #c8ced3',
  borderRadius: '12px',
  marginBottom: 2,
};

// ROLE

const roleSection: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const roleSectionStackIconButton: SxStyle = {
  width: '40px',
  height: '40px',
  background: 'white',
  border: '1px solid rgba(0,0,0,30%)',
  '&:hover': {
    background: 'white',
    color: 'black',
    border: '1px solid rgba(0,0,0,100%)',
  },
};

const roleSectionInputLabel: SxStyle = {
  fontSize: '12px',
  color: 'black',
};

const roleSectionButtonSubmit: SxStyle = {
  borderRadius: '6px',
  fontSize: { xs: '10px', md: '16px' },
  padding: '10px 20px',
};

// MANAGE ROLE

const manageRoleSection: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  padding: '20px 0',
  gap: '20px',
  marginTop: '30px',
};

//  ADD ROLE

const addRoleSectionButton: SxStyle = {
  width: { xs: '100px', sm: '130px' },
  borderRadius: '10px',
  fontSize: { xs: '10px', md: '16px' },
  paddingY: '12px',
};

const addRoleSectionTextFieldSelect: SxStyle = {
  width: { xs: '100%', md: '50%' },
  height: 'fit-content',
  borderRadius: '15px',
  background: 'white',
  border: '1px solid rgba(0,0,0,30%)',
  fontSize: '14px',
  '&:hover': {
    border: '1px solid rgba(0,0,0,100%)',
  },
  '& fieldset': { border: 'none' },
};

const addRoleSectionStackTextFieldText: SxStyle = {
  display: 'flex',
  alignItems: { xs: 'start', md: 'center' },
  flexDirection: { xs: 'column', md: 'row' },
};

const addRoleSectionTextFieldTextArea: SxStyle = {
  background: 'white',
  borderRadius: '15px',
  fontSize: '14px',
  border: '1px solid rgba(0,0,0,30%)',
  outline: 'none',
  '&:hover': {
    border: '1px solid rgba(0,0,0,100%)',
  },
  '& fieldset': { border: 'none' },
};

const addRoleSectionStackButton: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: '1px solid rgba(0,0,0,30%)',
  padding: '20px 0',
  gap: { xs: '10px', sm: '20px' },
  marginTop: '30px',
};

// CONTENT HEADER

const contentHeader: SxStyle = {
  display: 'flex',
  padding: '24px 16px 16px 16px',
  position: 'relative',
  height: { xs: 'fit-content', sm: '160px' },
  background: 'rgb(0,0,0,30%)',
  width: '100%',
};

const contentHeaderContainer: SxStyle = {
  display: 'flex',
  color: '#fff',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 4, sm: 2 },
  height: '100%',
  width: { xs: '100%', xl: '1750px' },
  position: 'relative',
  left: '50%',
  transform: 'translateX(-50%)',
};

const contentHeaderImg: SxStyle = {
  position: 'absolute',
  objectFit: 'cover',
  top: 0,
  left: 0,
  zIndex: '-10',
  width: '100%',
  height: '100%',
};

const contentHeaderStack1: SxStyle = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  width: '100%',
  gap: { xs: '30px', sm: '16px' },
};

const contentHeaderBoxCard: SxStyle = {
  display: { xs: 'none', md: 'block' },
  width: '280px',
  height: '176px',
};

const contentHeaderStack2: SxStyle = {
  width: { xs: '100%', md: 'calc(100% - 280px)' },
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: '16px', sm: '0' },
  justifyContent: 'space-between',
};

const contentHeaderBox1: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'end',
  gap: '4px',
  width: { xs: '100%', sm: '55%', md: '60%' },
};

const contentHeaderBox2: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: { xs: '100%', sm: '40%', md: '35%' },
  alignSelf: { xs: 'start', sm: 'end' },
};

const contentHeaderBox2Typography: SxStyle = {
  fontWeight: 'bold',
  fontSize: '14px',
  mb: '8px',
};

const contentHeaderBoxTypography1: SxStyle = {
  fontSize: { xs: '15px', sm: '20px' },
};

const contentHeaderBoxTypography2: SxStyle = {
  fontSize: { xs: 25, md: 26, lg: 30 },
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const contentHeaderButton: SxStyle = {
  width: 80,
  height: 40,
  fontSize: '12px',
  fontWeight: 700,
  alignSelf: 'end',
  borderRadius: '25px',
  textTransform: 'capitalize',
};

// USER CARD

const card: SxStyle = {
  width: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
  backgroundColor: '#014769',
  borderRadius: '6px',
};

const cardBox1: SxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const cardBoxButton: SxStyle = {
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '4px 8px',
};

const cardBox2: SxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  color: '#fff',
};

const cardBoxTypography1: SxStyle = {
  fontSize: '16px',
  fontWeight: 600,
};

const cardBoxTypography2: SxStyle = {
  fontSize: '12px',
  opacity: 0.8,
};

const cardBoxTypography3: SxStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
};

// TABLE

const tableCell: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '3px',
  fontWeight: 'bold',
  fontSize: '16px',
};

const tableCellStack: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  height: '20px',
  position: 'relative',
};

// MODUL PROFILE MENU

const modulProfileMenu: SxStyle = {
  position: { xs: 'fixed', xl: 'absolute' },
  top: '55px',
  right: '16px',
  zIndex: 10,
  width: '340px',
};

const modulPreset: SxStyle = {
  position: 'absolute',
  top: '40px',
  right: 0,
  zIndex: 10,
  width: '230px',
};

const modulPresetContainer: SxStyle = {
  borderRadius: '6px',
  boxShadow: '0px 0px 5px #33333333',
  display: 'box',
  maxHeight: '165px',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none' /* IE and Edge */,
  scrollbarWidth: 'none',
};

const modulSearch: SxStyle = {
  position: 'absolute',
  top: '75px',
  left: 0,
  zIndex: 10,
  width: '100%',
};

const modulSearchContainer: SxStyle = {
  borderRadius: '6px',
  boxShadow: '1px 1px 5px #333333',
  display: 'box',
  maxHeight: '200px',
  overflowY: 'scroll',
  overflowX: 'clip',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none' /* IE and Edge */,
  scrollbarWidth: 'none',
};

const modulProfileMenuContainer: SxStyle = {
  borderRadius: '6px',
  boxShadow: '0px 0px 5px #33333333',
  display: 'box',
};

const modulProfileMenuAvatar: SxStyle = { width: '64px', height: '64px', objectFit: 'cover' };

const modulProfileMenuAvatarContainer: SxStyle = { display: 'flex', gap: '4px' };

const modulProfileMenuAvatarName: SxStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333333',
};

const modulProfileMenuAvatarID: SxStyle = { fontSize: '12px', color: '#333333' };

const modulProfileMenuPaperBox1: SxStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  borderBottom: '1px solid #D8D8D8',
  '&:hover': {
    background: '#f1f3f5',
    borderRadius: '6px',
  },
};

const modulProfileMenuPaperBox2: SxStyle = {
  width: '100%',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  '&:hover': {
    background: '#f1f3f5',
  },
};

const activeModulSearch: SxStyle = {
  width: '100%',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  background: '#20a8d8',
};

const modulPresetContent: SxStyle = {
  width: '100%',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  '&:hover': {
    background: '#f1f3f5',
  },
};

const modulPresetContentActive: SxStyle = {
  width: '100%',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  background: '#D4ECF7',
};

const modulProfileMenuPaperBoxActive: SxStyle = {
  width: '100%',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  background: '#D4ECF7',
};

const modulProfileMenuPaperBox3: SxStyle = {
  width: '100%',
  padding: '16px',
  height: 'auto',
  background: '#fffff',
  display: 'flex',
  color: 'gray',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
  gap: '16px',
  borderTop: '1px solid #E5E5E5',
  '&:hover': {
    background: '#f1f3f5',
    borderRadius: '6px',
  },
};

const modulProfileBoxIcon: SxStyle = {
  width: '20px',
  height: '20px',
  background: '#999999',
  border: '1px solid #00000000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '2px',
};

const modulPresetIconActive: SxStyle = { fontSize: '16px' };
const modulPresetIcon: SxStyle = { fontSize: '16px', opacity: 0 };

const modulProfileIcon1: SxStyle = { fontSize: '16px', color: 'white' };

const modulProfileIcon2: SxStyle = { color: '#999999', fontSize: '22px' };

const modulProfileIconName: SxStyle = {
  fontSize: '14px',
  color: '#333333',
};

const modulPresetName: SxStyle = {
  fontSize: '14px',
  color: '#333333',
  width: '100%',
  textAlign: 'start',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const modulProfileBoxIconRounded: SxStyle = {
  width: '20px',
  height: '20px',
  background: '#999999',
  border: '1px solid #00000000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '20px',
};

// OVERLAY PROFILE MENU

const overlay: SxStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 9,
};

const boxOverlay: SxStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'none',
  position: 'fixed',
  cursor: 'move',
  top: 0,
  left: 0,
  zIndex: 2,
};
// USER ROLE CARD

const userRoleCardActive: SxStyle = {
  width: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '8px',
  backgroundColor: '#014769',
  borderRadius: '6px',
  color: 'white',
};

const userRoleCardBox: SxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  color: '#33333',
};

const userRoleCard: SxStyle = {
  width: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '10px',
  backgroundColor: '#ecebeb',
  borderRadius: '6px',
  color: '#333',
};

// BUTTON

export const homeStyle = {
  widgetBoxTitle,
  widgetBoxCard,
  widgetBoxOnEditMode,
  roleSection,
  roleSectionStackIconButton,
  roleSectionInputLabel,
  roleSectionButtonSubmit,
  manageRoleSection,
  addRoleSectionButton,
  addRoleSectionStackTextFieldText,
  addRoleSectionTextFieldSelect,
  addRoleSectionTextFieldTextArea,
  addRoleSectionStackButton,
  contentHeader,
  contentHeaderContainer,
  contentHeaderImg,
  contentHeaderBoxCard,
  contentHeaderStack1,
  contentHeaderStack2,
  contentHeaderBox1,
  contentHeaderBoxTypography1,
  contentHeaderBoxTypography2,
  contentHeaderBox2,
  contentHeaderBox2Typography,
  contentHeaderButton,
  card,
  cardBox1,
  cardBoxButton,
  cardBox2,
  cardBoxTypography1,
  cardBoxTypography2,
  cardBoxTypography3,
  tableCell,
  tableCellStack,
  modulPreset,
  modulPresetContainer,
  modulProfileMenu,
  modulProfileMenuAvatar,
  modulProfileMenuAvatarContainer,
  modulProfileMenuAvatarName,
  modulProfileMenuAvatarID,
  modulProfileMenuContainer,
  modulProfileMenuPaperBox1,
  modulProfileMenuPaperBox2,
  activeModulSearch,
  modulProfileMenuPaperBox3,
  modulProfileMenuPaperBoxActive,
  modulPresetContent,
  modulPresetContentActive,
  modulProfileBoxIcon,
  modulPresetIcon,
  modulPresetIconActive,
  modulProfileIcon1,
  modulProfileIcon2,
  modulProfileBoxIconRounded,
  modulProfileIconName,
  modulPresetName,
  modulSearch,
  modulSearchContainer,
  overlay,
  boxOverlay,
  userRoleCard,
  userRoleCardBox,
  userRoleCardActive,
};
