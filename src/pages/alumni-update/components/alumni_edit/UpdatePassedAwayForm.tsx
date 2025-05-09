import {
  Box,
  FormControl,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import CustomLoadingButton from '../../../../components/common/CustomLoadingButton';
import ErrorMessage from '../../../../components/common/error_message/ErrorMessage';
import PageWrapper from '../../../../components/container/PageWrapper';
import apiClient from '../../../../config/api-client';
import { ApiService } from '../../../../constants/ApiService';
import { store } from '../../../../store';
import { setError } from '../../../../store/error/slice';
import { themes } from '../../../../styles/mui/theme';
import {
  AlumniUpdatePayload,
  UpdateAlumniPassedAway,
} from '../../interface/Alumni';

const validationSchema = Yup.object().shape({
  evidenceType: Yup.string().trim().required('Evidence type is required'),
  evidence: Yup.mixed().when('evidenceType', (evidenceType: string[], schema) =>
    evidenceType[0] === 'file'
      ? schema
          .required()
          .test(
            'fileFormat',
            'Only PNG, JPG, JPEG, PDF are allowed',
            value =>
              value &&
              [
                'image/png',
                'image/jpg',
                'image/jpeg',
                'application/pdf',
              ].includes((value as File).type)
          )
          .test(
            'fileSize',
            'Maximum file size is 2MB',
            value => value && (value as File).size <= 2 * 1024 * 1024
          )
      : Yup.string().required().url('Must be a valid URL')
  ),
  alive: Yup.boolean().required(),
});

interface UpdatePassedAwayFormProps {
  alumni: AlumniUpdatePayload;
  editable: boolean;
}

export default function UpdatePassedAwayForm({
  alumni,
  editable,
}: UpdatePassedAwayFormProps) {
  const Navigate = useNavigate();

  const formik = useFormik<UpdateAlumniPassedAway>({
    initialValues: {
      alive: false,
      evidence: alumni.evidence,
      evidenceType: alumni.evidence != null ? 'url' : 'file',
    },
    validationSchema,
    onSubmit: async values => {
      const payload = values;

      try {
        if (
          typeof payload.evidence !== 'string' &&
          payload.evidenceType === 'file'
        ) {
          const path = `alumni/${alumni.alumniId}/UpdateAlumni`;
          const fileName = `evidence-passed-away.${payload.evidence?.name
            .split('.')
            .pop()}`;

          await apiClient.post(
            `${ApiService.storage}`,
            {
              file: payload.evidence,
              fileName,
              path,
              isCdn: true,
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          payload.evidence = `${ApiService.storage}/cdn?uri=${path}/${fileName}`;
        }

        await apiClient.patch(
          `${ApiService.alumni}/${alumni.alumniId}`,
          formik.values,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        Navigate('/update-alumni/approval');

        store.dispatch(
          setError({
            type: 'success',
            message: 'Edit alumni request is submitted successfully',
            title: 'Success',
          })
        );
      } catch (error: unknown) {
        let errorMessage = 'Something went wrong, please try again later.';

        if (error instanceof AxiosError) {
          errorMessage = error.response?.data ?? errorMessage;
        }

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        store.dispatch(
          setError({
            type: 'failed',
            message: errorMessage,
            title: 'Data can not be updated',
          })
        );
      }
    },
  });

  return (
    <PageWrapper>
      <Box component="section">
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth>
            <Typography variant="label" marginBottom={1}>
              Evidence
            </Typography>

            <Stack direction="row">
              <Select
                name="evidenceType"
                value={formik.values.evidenceType}
                onChange={current => {
                  formik.setFieldValue('evidenceType', current.target.value);
                  formik.setFieldValue('evidence', null);
                }}
                disabled={!editable || formik.isSubmitting}
                sx={{
                  minWidth: '12%',
                  input: {
                    borderRadius: '200px !important',
                  },
                  borderRadius: '200px !important',
                }}
              >
                <MenuItem value="url">
                  <Typography
                    variant="label"
                    sx={{ marginBottom: '0 !important' }}
                  >
                    URL
                  </Typography>
                </MenuItem>
                <MenuItem value="file">
                  <Typography
                    variant="label"
                    sx={{ marginBottom: '0 !important' }}
                  >
                    File
                  </Typography>
                </MenuItem>
              </Select>

              {formik.values.evidenceType === 'url' ? (
                <TextField
                  name="evidence"
                  value={formik.values.evidence}
                  onChange={formik.handleChange}
                  placeholder="Input your URL"
                  variant="outlined"
                  disabled={!editable || formik.isSubmitting}
                  sx={{
                    height: '100%',
                    width: '100%',
                    input: {
                      border: 'none',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      color: 'secondary',
                      fontSize: '14px',
                    },
                  }}
                />
              ) : (
                <Stack
                  width="100%"
                  display="flex"
                  alignItems="center"
                  direction="row"
                >
                  <label
                    htmlFor="evidence"
                    style={{
                      color: 'secondary',
                      cursor: 'pointer',
                      padding: '0 6px',
                      width: '100%',
                      height: '100%',
                      backgroundColor: editable ? 'white' : '#D6D6D6',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottomRightRadius: '6px',
                      borderTopRightRadius: '6px',
                      pointerEvents: editable ? 'auto' : 'none',
                    }}
                  >
                    {formik.values.evidence &&
                    typeof formik.values.evidence !== 'string' ? (
                      <>
                        <Typography
                          variant="label"
                          color="secondary"
                          marginRight={1}
                          sx={{ marginBottom: '0 !important' }}
                        >
                          Change File
                        </Typography>
                        <Link
                          href={URL.createObjectURL(formik.values.evidence)}
                          target="_blank"
                          fontSize="12px"
                        >
                          {formik.values.evidence.name}
                        </Link>
                      </>
                    ) : (
                      <Typography
                        fontSize="14px"
                        color="secondary"
                        sx={{ marginBottom: '0 !important' }}
                      >
                        Choose File
                      </Typography>
                    )}
                    <input
                      type="file"
                      id="evidence"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={current => {
                        formik.setFieldValue(
                          'evidence',
                          current.target.files?.[0]
                        );
                      }}
                      hidden
                    />
                  </label>
                </Stack>
              )}
            </Stack>

            <ErrorMessage formik={formik} name="evidence" />
          </FormControl>

          {formik.values.evidenceType === 'file' && (
            <Box marginTop={2}>
              <Typography
                variant="label"
                display="block"
                color={themes.palette.error.main}
              >
                *Maximum Size: 2MB
              </Typography>
              <Typography
                variant="label"
                display="block"
                color={themes.palette.error.main}
              >
                *Extension Evidence: JPG, PNG, JPEG, PDF
              </Typography>
            </Box>
          )}

          {editable && (
            <Box
              component="div"
              justifyContent="flex-end"
              display="flex"
              gap={2}
              marginTop={2}
            >
              <CustomLoadingButton
                color="secondary"
                variant="contained"
                onClick={() => Navigate('/update-alumni/list')}
                loading={formik.isSubmitting}
                sx={{ fontSize: '13px' }}
              >
                Cancel
              </CustomLoadingButton>

              <CustomLoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loading={formik.isSubmitting}
                disabled={!formik.isValid && formik.submitCount > 0}
                sx={{ fontSize: '13px' }}
              >
                Save
              </CustomLoadingButton>
            </Box>
          )}
        </form>
      </Box>
    </PageWrapper>
  );
}
