import {
  Box,
  Button,
  Divider,
  FormControl,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import CustomLoadingButton from '../../../components/common/CustomLoadingButton';
import ErrorMessage from '../../../components/common/error_message/ErrorMessage';
import SingleSelect from '../../../components/common/singleselect/SingleSelect';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import { Option } from '../../../interfaces/ITypes';
import { modalAlertStyle } from '../../../styles/common/modal-alert';

export function ModalCity({
  open,
  handleClose,
  countries,
  selectedCountryId,
  refreshCity,
}: {
  open: boolean;
  handleClose: () => void;
  countries: Option[];
  selectedCountryId?: string;
  refreshCity: () => void;
}) {
  const validationSchema = Yup.object({
    countryId: Yup.string().trim().required('Country is required'),
    cityName: Yup.string().trim().required('City is required'),
  });

  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      countryId: selectedCountryId,
      cityName: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async values => {
      setIsLoading(true);

      try {
        await apiClient.post(`${ApiService.city}`, values);

        handleClose();
        formik.resetForm();
        refreshCity();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.request.status === 400) {
            formik.setFieldError('cityName', error.response?.data);
          } else {
            formik.setFieldError('cityName', 'An unexpected error occurred.');
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Modal open={open} onClose={handleClose} sx={modalAlertStyle.modalAlert}>
      <Box
        sx={{
          maxHeight: '80vh',
          overflowY: 'auto',
          ...modalAlertStyle.modalAlertContainer,
          minHeight: 'fit-content',
          width: '70%',
          justifyContent: 'stretch',
          alignItems: 'stretch',
        }}
      >
        <Box component="section" marginBottom={2}>
          <Stack padding={1}>
            <Typography variant="body1" fontWeight="bold">
              Create City
            </Typography>
          </Stack>
          <Divider />
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Typography variant="label">Country</Typography>

            <SingleSelect
              name="countryId"
              data={countries.filter(country => country.value !== 'ID')}
              value={formik.values.countryId}
              onChange={value => formik.setFieldValue('countryId', value)}
              disabled={formik.isSubmitting}
            />

            <ErrorMessage formik={formik} name="countryId" />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">City</Typography>

            <TextField
              name="cityName"
              variant="outlined"
              size="small"
              slotProps={{ inputLabel: { style: { fontSize: '14px' } } }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />

            <ErrorMessage formik={formik} name="cityName" />
          </FormControl>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={modalAlertStyle.modalAlertButton}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <CustomLoadingButton
              loading={isLoading}
              variant="contained"
              color="primary"
              sx={modalAlertStyle.modalAlertButton}
              type="submit"
            >
              Submit
            </CustomLoadingButton>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
