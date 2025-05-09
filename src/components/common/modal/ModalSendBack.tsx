import {
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import CustomLoadingButton from '../CustomLoadingButton';

interface ModalSendBackProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (arg0: string) => void;
  recipient?: string[];
}

export default function ModalSendBack({
  open,
  handleClose,
  handleSubmit,
  recipient = [],
}: ModalSendBackProps) {
  const validationSchema = Yup.object({
    sendReason: Yup.string().trim().required('Reason is required'),
  });

  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      sendReason: '',
    },
    validationSchema,
    onSubmit: values => {
      setIsLoading(true);

      handleSubmit(values.sendReason);
      handleClose();
      setIsLoading(false);

      formik.resetForm();
    },
  });

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
          maxHeight: '80%',
          overflow: 'auto',
        }}
      >
        <Box component="section">
          <Stack padding={1}>
            <Typography variant="body1" fontWeight="bold">
              Send Back Reason
            </Typography>
          </Stack>
          <Divider />
        </Box>
        <Box component="section" padding={2} paddingTop={1}>
          <form onSubmit={formik.handleSubmit}>
            {recipient.length > 0 && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Dear {recipient.join(', ')}
              </Typography>
            )}
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
                error={
                  formik.touched.sendReason && Boolean(formik.errors.sendReason)
                }
                helperText={
                  formik.touched.sendReason && formik.errors.sendReason
                }
              />
            </Box>
            <Typography variant="label" sx={{ mt: 2 }}>
              Regards,
              <br />
              ARO
            </Typography>
            <Stack
              direction="row"
              justifyContent="flex-end"
              gap="20px"
              sx={{ width: '100%', marginTop: '20px' }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                sx={{ fontSize: '13px' }}
              >
                Cancel
              </Button>

              <CustomLoadingButton
                loading={isLoading}
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid}
                sx={{ fontSize: '13px' }}
              >
                Save
              </CustomLoadingButton>
            </Stack>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}
