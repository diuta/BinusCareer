import { 
    Box,
    Button,
    CircularProgress,
    Divider,
    Modal,
    Stack,
    TextField,
    Typography  } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import CustomLoadingButton from '../../../components/common/CustomLoadingButton';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import useModal from '../../../hooks/use-modal';
import { selectProfile } from '../../../store/profile/selector';
import { layoutPrivateStyle } from '../../../styles/layout/private-routes';

interface DeletePopUpProps {
    open: boolean;
    id: number;
    handleClose: () => void;
}
export function DeletePopUp({open,id, handleClose} : DeletePopUpProps){
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { showModal } = useModal();

    const handleCloseModal = () => {
      formik.resetForm();
      setIsLoading(false);
      handleClose();
    }

    const userProfile = useSelector(selectProfile);
    const { binusianId, currentRole } = userProfile;

    const [initialValues, setInitialValues] = useState({
      engagementId: 0,
      reason: '',
      userId: ''
    });

    const validationSchema = Yup.object({
      "reason": Yup.string().nullable().required("Reason is Required"),
    });

    const formik = useFormik({
      initialValues,
      enableReinitialize: true,
      validationSchema,
      onSubmit: async (values) => {
          setIsLoading(true);
          apiClient.post(`${ApiService.engagement}/delete?currentRole=${currentRole}`, {
            engagementId: id,
            reason: values.reason,
            userId: binusianId
        })
        .then(resp => resp)
        .then(resp => {
          if(resp.status === 200){
            showModal({
              title: 'Success',
              message:
                'Request Data Deleted Successfully',
              options: {
                variant: 'success',
                onOk:() => {
                  setIsLoading(false);
                  handleCloseModal();
                  navigate('/engagement/approval')
                },
                onClose:() => {
                  setIsLoading(false);
                  handleCloseModal();
                  navigate('/engagement/approval')
                }
              },
            });
          }
        })
        .catch(error_ => {
          showModal({
            title: 'Failed',
            message:
              'Data Delete Failed',
            options: {
              variant: 'failed',
              onOk:() => {
                setIsLoading(false);
              },
              onClose:() => {
                setIsLoading(false);
              }
            },
          });
        });
      },
  });

    return(
      <Modal open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              position:'absolute',
              top:'50%',
              left:'50%',
              transform:'translate(-50%, -50%)', 
              width: '30%', 
              bgcolor: 'background.paper', 
              boxShadow: 24, 
              p: 4, 
              maxHeight: '80%', 
              overflow: 'auto' 
            }}>
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography sx={{fontSize:'16px', fontWeight:700}}>Reason</Typography>
              </Stack>
              <Divider sx={{marginTop:'10px',  marginBottom:'30px'}}/>
              <Box sx={{ mt: 2 }}>
                  <TextField
                      multiline
                      fullWidth
                      variant='outlined'
                      placeholder='Enter reason...'
                      id="reason"
                      name="reason"
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={formik.touched.reason && formik.errors.reason}
                      error={formik.touched.reason && Boolean(formik.errors.reason)}
                      autoComplete='off'
                  />
              </Box>
              <Stack direction='row' justifyContent='flex-end'gap='20px' sx={{width:'100%', marginTop:'20px'}}>
                  <Box>
                      <Button
                          variant="contained"
                          color="secondary"
                          sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                          size='medium'
                          onClick={handleCloseModal}
                      >
                          <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Cancel</Typography>
                      </Button>
                  </Box>
                  <Box>
                      <CustomLoadingButton
                          loading={isLoading}
                          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
                          variant="contained"
                          color="primary"
                          sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
                          size='medium'
                          type='submit'
                          disabled={formik.isSubmitting || !formik.isValid || formik.values.reason == ''}
                      >
                          <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{isLoading ? 'Loading...' : 'Save'}</Typography>
                      </CustomLoadingButton>
                  </Box>
              </Stack>
          </Box>
        </form>
      </Modal>
    );
  };

export default DeletePopUp;
DeletePopUp.propTypes = null;

