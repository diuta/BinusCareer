import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { formatDate, isValid, parse } from 'date-fns';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

import Datepicker from '../../../../components/common/Datepicker';
import ErrorMessage from '../../../../components/common/error_message/ErrorMessage';
import SelectAjax from '../../../../components/common/select_ajax/SelectAjax';
import { ApiService } from '../../../../constants/ApiService';
import { ChildUpdatePayload } from '../../interface/Child';

export default function ChildrenFormDialog({
  open,
  submitHandler,
  handleClose,
  childData,
  previousData,
}: {
  open: boolean;
  submitHandler: Dispatch<SetStateAction<ChildUpdatePayload[]>>;
  handleClose: () => void;
  childData?: ChildUpdatePayload | null;
  previousData: ChildUpdatePayload[];
}) {
  const formik = useFormik<ChildUpdatePayload>({
    initialValues: {
      alumniChildId: childData?.alumniChildId || '',
      alumniChildName: childData?.alumniChildName || '',
      alumniChildDateBirth: childData?.alumniChildDateBirth || '',
      alumniChildGenderId: childData?.alumniChildGenderId || '',
      alumniChildCountryId: childData?.alumniChildCountryId || '',
      isCreated: false,
      isUpdated: false,
      isDeleted: false,
    },
    validationSchema: Yup.object().shape({
      alumniChildName: Yup.string().trim().required('Name is required'),
      alumniChildDateBirth: Yup.string().trim().required('Date birth is required'),
      alumniChildGenderId: Yup.string().trim().required('Gender is required'),
      alumniChildCountryId: Yup.string().trim().required('Country is required'),
    }),
    onSubmit: values => {
      const parsedDate = parse(
        values.alumniChildDateBirth.toString(),
        'dd-MM-yyyy',
        new Date()
      );

      const isDateValid = isValid(parsedDate);

      const formattedDate = isDateValid
        ? formatDate(parsedDate, 'MM/dd/yyyy')
        : values.alumniChildDateBirth;

      const result = childData
        ? previousData.map(child =>
            child.alumniChildId === values.alumniChildId
              ? {
                  ...values,
                  alumniChildDateBirth: formattedDate,
                  isUpdated: true,
                }
              : child
          )
        : [
            ...previousData,
            {
              ...values,
              alumniChildId: uuidv4(),
              alumniChildDateBirth: formattedDate,
              isCreated: true,
            },
          ];

      formik.resetForm();
      submitHandler(result);
      handleClose();
    },
  });

  useEffect(() => {
    if (open === false) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (childData) {
      formik.setValues({
        alumniChildId: childData.alumniChildId,
        alumniChildName: childData.alumniChildName,
        alumniChildDateBirth: childData.alumniChildDateBirth,
        alumniChildGenderId: childData.alumniChildGenderId,
        alumniChildCountryId: childData.alumniChildCountryId,
        isCreated: childData.isCreated,
        isUpdated: childData.isUpdated,
        isDeleted: childData.isDeleted,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      sx={{ zIndex: 10 }}
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        {childData ? 'Edit Child' : 'Add Child'}
      </DialogTitle>
      <DialogContent sx={{ width: '100%' }}>
        <Box display="flex" gap={2} marginBottom={2}>
          <FormControl fullWidth>
            <Typography variant="label" marginBottom={1}>
              Name
            </Typography>
            <TextField
              name="alumniChildName"
              value={formik.values.alumniChildName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant="outlined"
              inputProps={{ style: { fontSize: '14px' } }}
              error={
                formik.touched.alumniChildName &&
                Boolean(formik.errors.alumniChildName)
              }
            />

            <ErrorMessage formik={formik} name="alumniChildName" />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label" marginBottom={1}>
              Date of Birth
            </Typography>
            <Datepicker
              value={
                formik.values.alumniChildDateBirth ===
                childData?.alumniChildDateBirth
                  ? formatDate(
                      formik.values.alumniChildDateBirth.toString(),
                      'dd-MM-yyyy'
                    )
                  : formik.values.alumniChildDateBirth
              }
              onChange={date =>
                formik.setFieldValue('alumniChildDateBirth', date)
              }
              id="alumniChildDateBirth"
              name="alumniChildDateBirth"
              maxDate={new Date()}
              autoClose
              error={
                formik.touched.alumniChildDateBirth &&
                Boolean(formik.errors.alumniChildDateBirth)
              }
              dateFormat="dd-MM-yyyy"
              clearIcon
            />

            <ErrorMessage formik={formik} name="alumniChildDateBirth" />
          </FormControl>
        </Box>

        <Box display="flex" gap={2}>
          <FormControl fullWidth>
            <Typography variant="label" marginBottom={1}>
              Gender
            </Typography>
            <SelectAjax
              name="alumniChildGenderId"
              value={formik.values.alumniChildGenderId}
              onChange={e => formik.setFieldValue('alumniChildGenderId', e)}
              apiEndpoint={ApiService.gender}
              selectType="single"
              error={
                formik.touched.alumniChildGenderId &&
                Boolean(formik.errors.alumniChildGenderId)
              }
            />

            <ErrorMessage formik={formik} name="alumniChildGenderId" />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label" marginBottom={1}>
              Country
            </Typography>
            <SelectAjax
              name="alumniChildCountryId"
              value={formik.values.alumniChildCountryId}
              onChange={e => formik.setFieldValue('alumniChildCountryId', e)}
              apiEndpoint={ApiService.country}
              selectType="single"
              error={
                formik.touched.alumniChildCountryId &&
                Boolean(formik.errors.alumniChildCountryId)
              }
            />
            <ErrorMessage formik={formik} name="alumniChildCountryId" />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClose}
          sx={{ fontSize: '12px' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => formik.handleSubmit()}
          autoFocus
          sx={{ fontSize: '12px' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
