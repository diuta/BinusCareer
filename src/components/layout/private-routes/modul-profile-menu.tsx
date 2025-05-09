/* eslint-disable @typescript-eslint/no-unused-vars */
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FeedbackIcon from '@mui/icons-material/Feedback';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import NotesIcon from '@mui/icons-material/Notes';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ShieldIcon from '@mui/icons-material/Shield';
import { Avatar, Stack } from '@mui/material';
import Box from '@mui/material/Box/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography/Typography';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/auth/slice';
import { setAuthToken, setAuthTokenAzureAD } from '../../../store/authToken/slice';
import { selectProfile } from '../../../store/profile/selector';
import { homeStyle } from '../../../styles/container/home';
import { ProfileMenuProps } from '../../../types/modul-login';

const openInNewTab = (url) => {
  window.open(url, '_blank', 'noreferrer');
};

export function ModulProfileMenu({ profileMenu, setProfileMenu }: ProfileMenuProps) {
  const containerRef = useRef(null);
  const user = useSelector(selectProfile);
  // const dispatch = useDispatch();
  const Navigate = useNavigate();

  return (
    <Box ref={containerRef} sx={homeStyle.modulProfileMenu}>
      <Paper
        elevation={4}
        sx={profileMenu ? homeStyle.modulProfileMenuContainer : { display: 'none' }}
      >
        <Box
          sx={homeStyle.modulProfileMenuPaperBox1}
          onClick={() => setProfileMenu?.(!profileMenu)}
        >
          <Avatar sx={homeStyle.modulProfileMenuAvatar} />
          <Stack sx={homeStyle.modulProfileMenuAvatarContainer}>
            <Typography sx={homeStyle.modulProfileMenuAvatarName}>{user?.fullName}</Typography>
            <Typography sx={homeStyle.modulProfileMenuAvatarID}>{user?.email}</Typography>
          </Stack>
        </Box>
        
        <Box sx={homeStyle.modulProfileMenuPaperBox3} onClick={() => Navigate('/logout')}>
          <ExitToAppIcon sx={homeStyle.modulProfileIcon2} />
          <Typography sx={homeStyle.modulProfileIconName}>Logout</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
