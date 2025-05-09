import { 
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import CustomLoadingButton from '../../../components/common/CustomLoadingButton';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import useModal from '../../../hooks/use-modal';
import { selectProfile } from '../../../store/profile/selector';
import { layoutPrivateStyle } from '../../../styles/layout/private-routes';

interface SendBackPopUpProps {
    open: boolean;
    selectedEngagement: { id: number; userIn: string }[]; 
    handleClose: () => void;
  }

const validationSchema = Yup.object({
  sendReason: Yup.string()
      .required('Reason is required')
});

export function SendBackPopUp({ open, selectedEngagement, handleClose }: SendBackPopUpProps) {
  const [isLoading, setIsLoading] = useState(false);
  const userProfile = useSelector(selectProfile);
  const { binusianId } = userProfile;
  const { showModal } = useModal();

  const formik = useFormik({
      initialValues: {
          sendReason: '',
      },
      validationSchema,
      onSubmit: (values) => {
        setIsLoading(true);

        const tempEngagementId = selectedEngagement.map(({ id, userIn }) => ({
            engagementId: id,
            request: 'Send Back',
            sendBackReason: values.sendReason,
            userId: binusianId,
        }));

      apiClient
          .post(`${ApiService.engagement}/approve`, tempEngagementId)
          .then((resp) => {
              if (resp.status === 200) {
                  showModal({
                      title: 'Success',
                      message: 'Request Data Send Back Success',
                      options: {
                          variant: 'success',
                          onOk: () => {
                              setIsLoading(false);
                              window.location.reload();
                          },
                          onClose: () => {
                              setIsLoading(false);
                              window.location.reload();
                          },
                      },
                  });
              }
          })
          .catch(error_ => {
            showModal({
                title: 'Failed',
                message: 'Data Send Back Failed',
                options: {
                    variant: 'failed',
                    onOk: () => setIsLoading(false),
                    onClose: () => setIsLoading(false),
                },
            });
          })
          .finally(() => handleClose());
      },
  });

  const uniqueUserInNames = [...new Set(selectedEngagement.map(({ userIn }) => userIn))];

  return (
      <Modal open={open} onClose={handleClose}>
          <Box
              sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '30%',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  maxHeight: '80%',
                  overflow: 'auto',
              }}
          >
              <form onSubmit={formik.handleSubmit}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{fontSize:'16px', fontWeight:700}}>Send Back Reason</Typography>
                </Stack>
                <Divider sx={{marginTop:'10px',  marginBottom:'30px'}}/>
                  <Typography sx={{ mt: 2, fontSize:'12px', fontWeight:400 }}>
                    Dear {uniqueUserInNames.join(', ')}
                    </Typography>
                  <Box sx={{ mt: 2 }}>
                      <TextField
                          multiline
                          fullWidth
                          variant="outlined"
                          placeholder="Enter reason..."
                          name="sendReason"
                          value={formik.values.sendReason}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.sendReason && Boolean(formik.errors.sendReason)}
                          helperText={formik.touched.sendReason && formik.errors.sendReason}
                      />
                  </Box>
                  <Typography sx={{ mt: 2, fontSize:'12px', fontWeight:400 }}>Regards,<br />ARO</Typography>
                  <Stack
                      direction="row"
                      justifyContent="flex-end"
                      gap="20px"
                      sx={{ width: '100%', marginTop: '20px' }}
                  >
                      <Box>
                          <Button
                              variant="contained"
                              color="secondary"
                              sx={{ ...layoutPrivateStyle.modalChangeButton, width: '100px' }}
                              size="medium"
                              onClick={handleClose}
                          >
                              <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>
                                  Cancel
                              </Typography>
                          </Button>
                      </Box>
                      <Box>
                          <CustomLoadingButton
                              loading={isLoading}
                              startIcon={
                                  isLoading ? (
                                      <CircularProgress size={20} color="inherit" />
                                  ) : undefined
                              }
                              variant="contained"
                              color="primary"
                              sx={{ ...layoutPrivateStyle.modalChangeButton, width: '100px' }}
                              size="medium"
                              type="submit"
                              disabled={formik.isSubmitting || !formik.isValid || isLoading || formik.values.sendReason == ''}
                          >
                              <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>
                                  {isLoading ? 'Loading...' : 'Save'}
                              </Typography>
                          </CustomLoadingButton>
                      </Box>
                  </Stack>
              </form>
          </Box>
      </Modal>
  );
}

export default SendBackPopUp;
SendBackPopUp.propTypes = null;
