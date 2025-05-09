/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import {
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { layoutPrivateStyle } from '../../styles/layout/private-routes';

type NotificationProps = {
  showNotification: boolean;
  setShowNotification: Dispatch<SetStateAction<boolean>>;
};

export function Notification({ showNotification, setShowNotification }: NotificationProps) {
  const DS_NOTIFICATION_LIST = [
    {
      id: 1,
      subApp: '',
      sender: 'Student Advisory Center',
      acadCareer: 'Undergraduate',
      institution: 'Binus University',
      message: 'posted new',
      data: 'announcement',
      date: '2h',
      img: 'https://stresourcestest.blob.core.windows.net/thumbnails/defaultimage.png',
      isUnread: true,
      isImportant: false,
    },
    {
      id: 2,
      subApp: '',
      sender: 'Linda Stewart',
      acadCareer: 'Undergraduate',
      institution: 'Binus University',
      message: 'shared a',
      data: 'link',
      date: '2h',
      img: 'https://stresourcestest.blob.core.windows.net/thumbnails/defaultimage.png',
      isUnread: false,
      isImportant: true,
    },
  ];

  const [important, setImportant] = useState(false);
  const [unread, setUnread] = useState(true);

  return (
    <Drawer
      anchor="right"
      open={showNotification}
      onClose={() => setShowNotification(false)}
      PaperProps={{
        style: {
          boxShadow: '0px 0px 5px #33333333',
        },
      }}
      style={{ width: '0', zIndex: 5 }}
      hideBackdrop
      disableScrollLock
    >
      <Stack
        component="section"
        direction="column"
        marginTop="55px"
        width="358px"
        height="100%"
        sx={{
          background: '',
          position: 'relative',
          overflow: 'clip',
          boxShadow: '0px 0px 5px #33333333',
          '-webkit-box-shadow': '0px 0px 5px #33333333',
          '-moz-box-shadow': '0px 0px 5px #33333333',
        }}
      >
        <Stack
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" padding="15px">
            <Typography fontSize="16px" fontWeight="bold">
              Notification
            </Typography>
            <IconButton
              sx={{ height: '16px', width: '16px', cursor: 'pointer' }}
              onClick={() => setShowNotification(false)}
            >
              <CloseIcon sx={{ color: '#999999' }} />
            </IconButton>
          </Stack>
          <Stack
            paddingX="10px"
            direction="row"
            borderBottom="1px solid rgba(0,0,0,.1)"
            gap="30px"
            paddingBottom="10px"
          >
            {/* <Stack direction="row" alignItems="center">
              <Checkbox defaultChecked={unread} onChange={() => setUnread(!unread)} />
              <Typography fontSize="14px" color="#333333">
                Unread Only
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Checkbox defaultChecked={important} onChange={() => setImportant(!important)} />
              <Typography fontSize="14px" color="#333333">
                Important
              </Typography>
            </Stack> */}
            <Stack direction="row" alignItems="center">
              <Switch defaultChecked={unread} onChange={() => setUnread(!unread)} />
              <Typography fontSize="14px" color="#333333">
                Unread Only
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Switch defaultChecked={important} onChange={() => setImportant(!important)} />
              <Typography fontSize="14px" color="#333333">
                Important
              </Typography>
            </Stack>
          </Stack>
          <Stack padding="10px" direction="row" justifyContent="end">
            {/* <Stack sx={layoutPrivateStyle.notificationReadStack}>
              <RemoveRedEyeOutlinedIcon sx={layoutPrivateStyle.notificationReadIcon} />
              <Typography fontSize="14px" color="#028ED5" lineHeight="1.6">
                Mark All Read
              </Typography>
            </Stack> */}
            <Stack sx={layoutPrivateStyle.notificationReadStack}>
              <RemoveRedEyeIcon sx={layoutPrivateStyle.notificationReadIcon} />
              <Typography fontSize="14px" color="#028ED5">
                Mark All Read
              </Typography>
            </Stack>
            <Stack sx={{ ...layoutPrivateStyle.notificationReadStack, display: 'none' }}>
              <DeleteIcon sx={layoutPrivateStyle.notificationReadIcon} />
              <Typography fontSize="14px" color="#028ED5">
                Dismiss All
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {DS_NOTIFICATION_LIST.length > 0 ? (
          <Stack sx={layoutPrivateStyle.notificationListContainer}>
            {DS_NOTIFICATION_LIST.map((list) => (
              <Stack
                sx={{
                  ...layoutPrivateStyle.notificationListCard,
                  background: list.isUnread ? '#E5F3FB' : '#FFFFFF',
                  display:
                    unread && list.isUnread === false
                      ? 'none'
                      : important && list.isImportant === false
                      ? 'none'
                      : 'flex',
                }}
              >
                <Stack paddingY="10px" borderBottom="1px solid #D8D8D8">
                  <Typography fontSize="12px" lineHeight="1.6" color="#333333">
                    {''.concat(
                      list.subApp && `${list.subApp} - `,
                      list.acadCareer && `${list.acadCareer} - `,
                      list.institution && `${list.institution}`,
                    )}
                  </Typography>
                </Stack>
                <Stack paddingY="10px" direction="row" width="100%" gap="10px">
                  <Box
                    component="img"
                    src={list.img}
                    sx={layoutPrivateStyle.notificationListCardAvatar}
                  />
                  <Stack gap="0.5rem">
                    <Typography component="div" sx={layoutPrivateStyle.notificationListCardMessage}>
                      {`${list.sender} `}
                      <Box fontWeight="normal" display="inline">
                        {`${list.message} `}
                      </Box>{' '}
                      {`${list.data}`}
                    </Typography>
                    <Typography fontSize="12px" color="#333333" sx={{ boxSizing: 'border-box' }}>
                      {list.date}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Stack sx={layoutPrivateStyle.notificationListContainerNull}>
            <Box
              component="img"
              src="/assets/image/ilustrasi-no-upcoming-class.svg"
              width="310px"
            />
            <Stack>
              <Typography
                sx={layoutPrivateStyle.notificationListEmpty}
              >{`You don't have any notifications`}</Typography>
              <Typography fontSize="14px" textAlign="center">
                Please check back later.
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
}
