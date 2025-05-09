import { SxProps, Theme } from '@mui/material';
import { themes } from '../mui/theme';
import { SxStyle } from '../../types/style';

// LAYOUT

const layoutPrivateActive: SxStyle = {
  position: 'absolute',
  width: 'calc(100% - 240px)',
  height: 'calc(100vh - 55px)',
  overflowY: 'scroll',
  top: '55px',
  right: '0',
};

const layoutPrivate: SxStyle = {
  width: '100%',
  height: 'calc(100vh - 55px)',
  overflowY: 'scroll',
};

const privateRoutes: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const privateRoutesSideMenu: SxStyle = { width: { xs: '100%', xl: '100%' } };

const privateRoutesCandyBox: SxStyle = {
  width: { xs: '100%', xl: '1750px' },
  height: '100vh',
  position: 'relative',
};

// CARD

const card: SxStyle = {
  width: '100%',
  minHeight: '136px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '10px',
  backgroundColor: '#014769',
  borderRadius: '10px',
};

const cardBox1: SxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  gap: '3px',
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

const cardButton: SxStyle = {
  height: '20px',
  width: '59px',
  display: 'flex',
};

// SIDEMENU

const sideMenu: SxProps<Theme> = {
  position: 'relative',
  height: '100%',
  width: '52px',
  overflow: 'hidden',
};

const sideMenuPaperBox: SxProps<Theme> = {
  width: '100%',
  height: 'calc(100vh - 55px)',
  background: '#0097DA',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

const sideMenuIcon: SxStyle = { fontSize: '18px' };
const sideMenuIconCollapse: SxStyle = {
  fontSize: { xs: '14px', sm: '18px' },
};

const sideMenuLink: SxStyle = {
  color: 'white',
  display: 'flex',
  height: '37px',
  justifyContent: 'space-between',
  '&:hover': {
    background: '#0F7DB6',
  },
};

const sideMenuLinkCollapse: SxStyle = {
  color: 'white',
  display: 'flex',
  height: '37px',
  justifyContent: 'space-between',
  background: '#118AC9',
  '&:hover': {
    background: '#0F7DB6',
  },
};

const sideMenuLinkActive: SxStyle = {
  background: '#075581',
  color: 'white',
  display: 'flex',
  height: '37px',
  borderRadius: '37px 0 0 37px',
  justifyContent: 'space-between',
  '&:hover': {
    borderRadius: '37px 0 0 37px',
    background: '#075581',
  },
};

const sideMenuTitle: SxStyle = {
  fontSize: '13px',
};

const sideMenuTitleMobile: SxStyle = {
  display: { xs: 'block', sm: 'none' },
  fontSize: '13px',
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const sideMenuBoxCollapse: SxStyle = {
  color: 'white',
  display: 'flex',
  height: '37px',
  padding: '0',
  pl: 2,
  justifyContent: 'space-between',
  background: '#118AC9',
};

const sideMenuBoxCollapseLink: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '4px',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  pl: 2,
  '&:hover': {
    background: '#0F7DB6',
    borderRadius: '37px 0 0 37px',
  },
};

const sideMenuBoxCollapseLinkActive: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '4px',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  pl: 2,
  background: '#075581',
  borderRadius: '37px 0 0 37px',
  '&:hover': {
    background: '#075581',
    borderRadius: '37px 0 0 37px',
  },
};

const sideMenuLinkBox: SxProps<Theme> = {
  width: '44px',
  height: '44px',
  background: 'white',
  border: '7px solid #118DD4',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const sideMenuLinkBoxImg: SxProps<Theme> = {
  height: '20px',
  width: 'auto',
};

const sideMenuLinkTypography: SxProps<Theme> = {
  fontWeight: 'bold',
  fontSize: { xs: 14, sm: 16 },
};

const sideMenuBoxIcon: SxProps<Theme> = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: '34px',
  };

  const sideMenuBoxLink: SxProps<Theme> = {
    width: '100%',
    height: 'calc(100% - 105px)',
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'scroll',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none' /* IE and Edge */,
    'scrollbar-width': 'none',
  };

// SIDE MENU ADMIN

const sideMenuPrivateIcon: SxStyle = { fontSize: '22px', color: 'white' };

const sideMenuPrivateIconButton: SxStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  '&:hover': {
    opacity: '80%',
  },
};

const sideMenuPrivateIconButtonActive: SxStyle = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  '&:hover': {
    opacity: '80%',
  },
};

// SECTION

const sectionContainer: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: `calc(100% - 52px)`,
};

// FOOTER

const footer: SxStyle = {
  position: 'relative',
  bottom: '0',
  width: '100%',
  justifyContent: 'space-between',
  background: '#fff',
  padding: '16px',
  color: 'black',
  alignItems: 'center',
  fontFamily: '"Open Sans",sans-serif !important',
  display: 'flex',
  flexDirection: 'row',
  borderTop: '1px solid rgba(0,0,0,30%)',
};

// MANAGE TITLE
const manageTitleContainer: SxStyle = {
  display: 'flex',
  borderBottom: '1px solid rgba(0,0,0,10%)',
  padding: '20px',
  gap: '20px',
};

const manageTitle: SxStyle = {
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  fontSize: 24,
  // marginBottom: 2,
};

const manageTitleContainerHalf: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  borderBottom: '1px solid rgba(0,0,0,10%)',
  padding: '20px',
};

// MANAGE SEARCH

const manageSearch: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  gap: '20px',
  padding: '20px',
  borderBottom: '1px solid rgba(0,0,0,10%)',
};

const manageSearchContainer: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '65px',
  width: '100%',
};

const manageSearchTitle: SxStyle = {
  fontSize: '12px',
};

const manageSearchTextField: SxStyle = {
  background: 'white',
  width: '100%',
  borderRadius: '6px',
  '& fieldset': { border: '1px solid #D6D6D6', fontSize: '16px' },
  '& input': { border: 'none' },
  '&.Mui-focused fieldset': {
    border: `2px solid ${themes.palette.primary.main}`,
  },
  // padding: '0px 10px 0px 10px',
};

const manageSearchTextField2: SxStyle = {
  background: 'white',
  width: '100%',
  borderRadius: '6px',
  '& fieldset': { width: '100%', border: '1px solid #CCCCCC', fontSize: '16px' },
  input: { border: 'none' },
  padding: '0px 10px 0px 0px',
  '&.Mui-focused fieldset': {
    border: '2px solid rgb(38,132,255)',
  },
};

const manageSearchButton: SxStyle = {
  width: '80px',
  borderRadius: '6px',
  fontSize: '14px',
  paddingY: '10px 20px',
  color: 'white',
  height: '40px',
};

const manageSearchButtonText: SxStyle = {
  fontSize: { xs: '12px', sm: '14px' },
  lineHeight: 1.6,
  fontWeight: 600,
};

const manageSearchButtonAddText: SxStyle = {
  fontSize: { xs: '12px', sm: '14px' },
  lineHeight: 1.6,
  fontWeight: 600,
};

// MANAGE TABLE

const manageTable: SxStyle = { padding: '20px', mb: '50px' };

const moduleTable: SxStyle = { padding: '20px 20px 0px 20px' };

const manageTableContainer: SxStyle = { width: '100%', overflow: 'hidden', borderRadius: '6px' };

const manageTableCell: SxStyle = {
  height: '20px',
  padding: '10px',
};

const manageTableHead: SxStyle = {
  '& th': {
    backgroundColor: 'white',
    padding: { xs: '30px 16px 30px 16px', md: '21px 16px 21px 16px' },
  },
};

const moduleTableHead: SxStyle = {
  '& th': {
    backgroundColor: 'white',
    padding: '16px ',
  },
};

const manageTableCellContainer: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '20px',
  gap: 1,
};

const manageTableCellContainerCenter: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '20px',
  gap: 1,
};

const manageTableCellTypography: SxStyle = { fontWeight: 'bold', fontSize: '12px' };

const manageTableCellIconContainer: SxStyle = {
  height: '22px',
  position: 'relative',
  cursor: 'pointer',
};

const manageTableCellIconTopActive: SxStyle = { fontSize: '16px', position: 'absolute', top: 0 };

const manageTableCellIconTop: SxStyle = {
  fontSize: '16px',
  color: '#c8ced3',
  position: 'absolute',
  top: 0,
};

const manageTableCellIconBottomActive: SxStyle = {
  fontSize: '16px',
  position: 'absolute',
  bottom: 0,
};

const manageTableCellIconBottom: SxStyle = {
  fontSize: '16px',
  color: '#c8ced3',
  position: 'absolute',
  bottom: 0,
};

const manageTableRow: SxStyle = { '&:last-child td, &:last-child th': { border: 0 } };

const manageTableActions: SxStyle = {
  color: '#028ED5',
  cursor: 'pointer',
  fontSize: '12px',
  '&:hover': { opacity: '70%' },
};

const manageTableNoData: SxStyle = {
  display: 'flex',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
};

const manageTablePagination: SxStyle = {
  padding: '16px',
  width: '100%',
  gap: '17px',
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'start', md: 'center' },
  justifyContent: 'end',
  borderBottom: '1px solid #E0E0E0',
  borderTop: '1px solid #E0E0E0',
};

const manageTablePaginationContainer: SxStyle = {
  display: 'flex',
  flexDirection: { xs: 'columns', md: 'row' },
  gap: '9px',
  alignItems: { xs: 'start', md: 'center' },
  width: { xs: '100%', md: 'auto' },
};

const manageTablePaginationInput: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '9px',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: { xs: '100%', md: 'auto' },
};

const manageTablePaginate: SxStyle = {
  margin: 0,
  padding: 0,
  justifyContent: 'start',
  display: { xs: 'none', md: 'flex' },
  '.binus-PaginationItem-previousNext': { display: 'none' },
  '.binus-PaginationItem-page': {
    fontSize: '12px',
    padding: 0,
  },
  '.binus-Pagination-ul': {
    gap: 0,
    padding: 0,
    margin: 0,
  },
};

const manageTablePaginationText: SxStyle = { fontSize: '14px', color: '#333333' };

const manageTableButton: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '46px',
  gap: '5px',
  borderRadius: '6px',
  m: '11px 16px 16px 16px',
};

const manageTableButtonContainer: SxStyle = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid white',
};

const manageTableButtonIcon: SxStyle = { fontSize: '18px' };

const manageTablePaginationMaterial: SxStyle = {
  '.binus-TablePagination-actions': { display: 'flex' },
  '.binus-TablePagination-select': {
    display: 'flex',
    width: '30px',
    alignItems: 'center',
  },
};

const manageWidgetsContainer: SxStyle = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: '0', md: '25px' },
  width: '100%',
};

const manageWidgetsHalf: SxStyle = { width: { xs: '100%', md: '50%' } };

// EDITOR WIDGET

const editorWidget: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
  padding: '20px',
};

const editorWidgetContainer: SxStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };

const editorWidgetTitle: SxStyle = { fontSize: '12px', color: '#666666' };
const editorWidgetText: SxStyle = { fontSize: '14px', color: '#333333', fontWeight: 500 };

// DEFINE FORM

const defineFormSection: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'auto',
  marginBottom: '10px',
};

const defineIconButton: SxStyle = {
  width: '40px',
  height: '40px',
  background: '#fff',
  boxShadow: '0 0 3px 0 rgb(0 0 0 / 20%)',
  margin: '5px 0px 5px 20px ',
  '&:hover': { background: '#fff', opacity: '60%' },
};
const defineDisableTypography: SxStyle = {
  fontSize: 14,
  textAlign: 'center',
  padding: '15px 20px 15px 20px',
};

const defineIconButtonIcon: SxStyle = { fontSize: '32px' };

const defineFormInputForm: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  padding: '10px 20px 0px 20px',
};

const defineFormInputContainer: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: { xs: '100%', md: 'calc(50% - 20px)' },
  position: 'relative',
};

const defineFormInputContainerCheckbox: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '50%',
};

const defineFormInputContainerTextCheckbox: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
};

const defineFormInputContainerFull: SxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
};

const defineFormInputLabel: SxStyle = { fontSize: '12px', color: '#333', mb: 1 };
const defineFormInputLabelCheckbox: SxStyle = { fontSize: '12px', color: '#333' };
const defineFormInputFileUploaded: SxStyle = {
  height: '44px',
  width: '44px',
  objectFit: 'cover',
  mb: 1,
};

const defineFormInputImageContainer: SxStyle = {
  display: 'flex',
  gap: '15px',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'start', sm: 'center' },
};

const defineFormInputImageName: SxStyle = {
  width: { xs: '100%', sm: `calc(100% - 180px)` },
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const defineFormInput: SxStyle = {
  width: '100%',
};

const defineFormInputError: SxStyle = {
  width: '100%',
  height: '35px',
  background: '#FFDBD9',
  borderRadius: '6px',
  border: '1px solid #BE3528',
};

const defineFormInputFull: SxStyle = {
  width: '100%',
  height: 'auto',
  background: 'white',
  borderRadius: '6px',
  '& fieldset': {
    border: '1px solid rgba(0,0,0,.2)',
    fontSize: '14px',
  },
  '&.Mui-focused fieldset': {
    borderColor: 'rgba(0,0,0,.4)',
  },
};

const defineFormInputSelect: SxStyle = {
  width: { xs: '100%', md: '50%' },
  height: 'fit-content',
  borderRadius: '15px',
  background: 'white',
  border: '1px solid rgba(0,0,0,30%)',
  fontSize: '14px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    border: '1px solid rgba(0,0,0,100%)',
  },
  '& fieldset': { border: 'none' },
  '& .MuiOutlinedInput-input': {
    display: 'flex',
    alignItems: 'center',
  },
};

const defineFormSubmitContainer: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'end',
  gap: '10px',
  width: '100%',
  padding: '10px 20px 10px 20px',
  borderTop: '1px solid rgba(0,0,0,10%)',
  marginTop: '20px',
};

const defineFormButtonUpload: SxStyle = {
  width: '120px',
  borderRadius: '6px',
  fontSize: { xs: '12px', md: '14px' },
  paddingY: '10px 20px',
  color: 'white',
  height: '40px',
};

// ALTERNATE EMAILS

const alternateEmailContainer: SxStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginBottom: '50px',
};

const alternateEmailCard: SxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '325px',
  padding: '15px',
  borderRadius: '6px',
  border: '2px solid #014769',
  cursor: 'pointer',
  ': hover': {
    background: '#014769',
    color: 'white',
  },
};

// LIST EDITOR

const listEditor: SxStyle = {
  width: '100%',
  minHeight: '100%',
  height: 'auto',
  paddingBottom: '70px',
  position: 'relative',
  left: '50%',
  transform: 'translateX(-50%)',
};

const widgetBanner: SxStyle = {
  width: '100%',
  height: 160,
  // opacity: '70%',
  // '&:hover': {
  //   opacity: '100%',
  // },
};

const widgetBannerTitle: SxStyle = {
  color: 'rgba(0, 0, 0, 0.87)',
  lineHeight: 1.5,
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '8px',
};

const widgetBannerContent: SxStyle = {
  background: '#fff',
  width: '100%',
  height: '200px',
  border: '1px solid #c8ced3',
  borderRadius: '12px',
  padding: '20px',
};

// NOTIFICATION

const notificationBadge: SxStyle = {
    background: '#d73930',
    width: '26px',
    height: '16px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const notificationLink: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '3px solid transparent',
    padding: '7.5px 10px 7.5px 10px',
    cursor: 'pointer',
    ':hover': {
      borderBottom: '3px solid #F8C37F',
    },
  };
  
  const notificationLinkActive: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '3px solid #f18700',
    padding: '7.5px 10px 7.5px 10px',
    cursor: 'pointer',
    color: '#f8cb00',
    ':hover': {
      borderBottom: '3px solid #F8C37F',
    },
  };
  
  const notificationReadStack: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };
  
  const notificationReadIcon: SxStyle = { height: '16px', width: '16px', color: 'rgb(2, 142, 213)' };
  
  const notificationListContainer: SxStyle = {
    height: '100%',
    width: '100%',
    overflowY: 'scroll',
    position: 'relative',
    paddingBottom: '5px',
    zIndex: 0,
  };
  
  const notificationListContainerNull: SxStyle = {
    height: '100%',
    width: '100%',
    background: 'white',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  };
  
  const notificationListCard: SxStyle = {
    background: '#E5F3FB',
    margin: '10px 10px 5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid #CCCCCC',
    paddingX: '10px',
  };
  
  const notificationListCardAvatar: SxStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '100%',
  };
  
  const notificationListCardMessage: SxStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    color: '#333333',
  };
  
  const notificationListEmpty: SxStyle = {
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
  };

  // HEADER

const header: SxStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    width: '100%',
    height: '55px',
    padding: '0 16px',
    borderBottom: '1px solid #c8ced3',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const headerContainer: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: { xs: '100%', xl: '100%' },
  };
  
  const headerIcon: SxProps<Theme> = {
    width: '20px',
    height: '20px',
    objectFit: 'cover',
    cursor: 'pointer',
  };
  
  const headerImg: SxProps<Theme> = {
    height: '24px',
    cursor: 'pointer',
  };
  
  const headerDivider: SxProps<Theme> = {
    background: '#999999',
    width: '1px',
    height: '24px',
  };
  
  const headerTypography: SxProps<Theme> = {
    fontSize: '14px',
    textTransform: 'uppercase',
    color: '#333333',
    cursor: 'pointer',
  };
  
  const headerAvatar: SxProps<Theme> = {
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    objectFit: 'cover',
  };

  // OVERLAY

const overlay: SxProps<Theme> = {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.3)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
  };

  // MODAL CHANGE ROLE

const modalChange: SxStyle = {
    position: 'absolute',
    width: { xs: '270px', sm: '500px', md: '798px' },
    height: { xs: '455px', sm: '486px' },
    background: 'white',
    borderRadius: '6px',
  };
  
  const modalChangeTitle: SxStyle = { fontWeight: '700', fontSize: '16px', color: '#333' };
  
  const modalChangeIcon: SxStyle = {
    cursor: 'pointer',
    fontSize: '20px',
    color: '#999999',
    '&:hover': { color: '#333333' },
  };
  
  const modalChangeStack1: SxStyle = {
    p: '16px',
    borderBottom: '1px solid #c8ced3',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  
  const modalChangeStack2: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    height: 'auto',
    borderBottom: '1px solid #c8ced3',
  };
  
  const modalChangeStack3: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: { xs: '260px', sm: '300px' },
    overflowY: 'scroll',
    padding: '15px',
  };
  
  const modalChangeStack4: SxStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
    gap: '30px',
  };
  
  const modalChangeStack5: SxStyle = {
    position: 'relative',
    bottom: 0,
    width: '100%',
    background: 'white',
    borderRadius: '0 0 6px 6px',
    p: '16px',
    borderTop: '1px solid #c8ced3',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'end',
  };
  
  const userRoleBox: SxStyle = {
    width: { xs: '100%', sm: '200px', md: '223px' },
    height: '150px',
    cursor: 'pointer',
  };
  
  const modalChangeStack2Box: SxStyle = {
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  };
  
  const modalChangeBorderActive: SxStyle = {
    height: '4px',
    width: '100%',
    background: '#F18700',
    position: 'absolute',
    bottom: '-2px',
  };
  
  const modalChangeButton: SxStyle = {
    borderRadius: '6px',
    padding: '10px 20px',
  };

  // APP MENU

  const appMenuPaperBox: SxProps<Theme> = {
    width: { xs: '275px', sm: '300px' },
    padding: '16px',
    height: '100vh',
    background: '#fffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const appMenuBoxIcon: SxProps<Theme> = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: '34px',
  };

  const appMenuTitle: SxProps<Theme> = {
    fontFamily: 'Open Sans,sans-serif',
    fontSize: '16px',
    color: '#333333',
    letterSpacing: '0.12px',
    fontWeight: 'bold',
  };

  const appMenuBoxLink: SxProps<Theme> = {
    width: '100%',
    height: 'calc(100% - 105px)',
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'scroll',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none' /* IE and Edge */,
    'scrollbar-width': 'none',
  };

  const appMenuLink: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333333',
    '&:hover': {
      textDecoration: 'underline',
    },
  };

  const appMenuLinkBoxImg: SxProps<Theme> = {
    width: '30px',
    height: '30px',
    objectFit: 'cover',
  };

  const appMenuLinkTypography: SxProps<Theme> = {
    color: '#000',
    fontWeight: 400,
  };

  const appMenu: SxProps<Theme> = {
    position: { xs: 'fixed', xl: 'absolute' },
    top: 0,
    left: 0,
    height: 0,
    zIndex: 10,
  };

export const layoutPrivateStyle = {
  layoutPrivate,
  layoutPrivateActive,
  privateRoutes,
  privateRoutesSideMenu,
  privateRoutesCandyBox,
  card,
  cardBox1,
  cardBoxButton,
  cardBox2,
  cardButton,
  cardBoxTypography1,
  cardBoxTypography2,
  cardBoxTypography3,
  sideMenu,
  sideMenuPaperBox,
  sideMenuIcon,
  sideMenuIconCollapse,
  sideMenuLink,
  sideMenuLinkActive,
  sideMenuLinkCollapse,
  sideMenuTitle,
  sideMenuTitleMobile,
  sideMenuLinkBox,
  sideMenuLinkBoxImg,
  sideMenuLinkTypography,
  sideMenuBoxIcon,
  sideMenuBoxLink,
  sideMenuBoxCollapse,
  sideMenuBoxCollapseLink,
  sideMenuBoxCollapseLinkActive,
  sideMenuPrivateIcon,
  sideMenuPrivateIconButton,
  sideMenuPrivateIconButtonActive,
  footer,
  sectionContainer,
  manageTitleContainer,
  manageTitleContainerHalf,
  manageTitle,
  manageTableHead,
  moduleTableHead,
  manageTableCellContainer,
  manageSearch,
  manageSearchTitle,
  manageSearchContainer,
  manageSearchTextField,
  manageSearchTextField2,
  manageSearchButton,
  manageSearchButtonText,
  manageSearchButtonAddText,
  manageTable,
  moduleTable,
  manageTableContainer,
  manageTableCell,
  manageTableCellTypography,
  manageTableCellIconContainer,
  manageTableCellIconTopActive,
  manageTableCellIconTop,
  manageTableCellIconBottomActive,
  manageTableCellIconBottom,
  manageTableRow,
  manageTableActions,
  manageTableNoData,
  manageTablePagination,
  manageTablePaginationContainer,
  manageTablePaginationInput,
  manageTablePaginate,
  manageTablePaginationText,
  manageTableButton,
  manageTableButtonContainer,
  manageTableButtonIcon,
  manageTablePaginationMaterial,
  manageTableCellContainerCenter,
  manageWidgetsContainer,
  manageWidgetsHalf,
  defineFormSection,
  defineIconButton,
  defineDisableTypography,
  defineIconButtonIcon,
  defineFormInputForm,
  defineFormInputContainer,
  defineFormInputContainerTextCheckbox,
  defineFormInputContainerCheckbox,
  defineFormInputContainerFull,
  defineFormInputLabel,
  defineFormInputLabelCheckbox,
  defineFormInputFileUploaded,
  defineFormInput,
  defineFormInputError,
  defineFormInputFull,
  defineFormInputSelect,
  defineFormSubmitContainer,
  defineFormButtonUpload,
  defineFormInputImageContainer,
  defineFormInputImageName,
  alternateEmailContainer,
  alternateEmailCard,
  editorWidget,
  editorWidgetContainer,
  editorWidgetTitle,
  editorWidgetText,
  listEditor,
  widgetBannerTitle,
  widgetBanner,
  widgetBannerContent,
  notificationLinkActive,
  notificationBadge,
  notificationLink,
  notificationReadStack,
  notificationReadIcon,
  notificationListContainer,
  notificationListContainerNull,
  notificationListCard,
  notificationListCardAvatar,
  notificationListCardMessage,
  notificationListEmpty,
  header,
  headerContainer,
  headerIcon,
  headerImg,
  headerDivider,
  headerTypography,
  headerAvatar,
  overlay,
  modalChange,
  modalChangeTitle,
  modalChangeIcon,
  modalChangeStack1,
  modalChangeStack2,
  modalChangeStack3,
  modalChangeStack4,
  modalChangeStack5,
  userRoleBox,
  modalChangeStack2Box,
  modalChangeBorderActive,
  modalChangeButton,
  appMenuPaperBox,
  appMenuBoxIcon,
  appMenuTitle,
  appMenuBoxLink,
  appMenuLink,
  appMenuLinkBoxImg,
  appMenuLinkTypography,
  appMenu,
};
