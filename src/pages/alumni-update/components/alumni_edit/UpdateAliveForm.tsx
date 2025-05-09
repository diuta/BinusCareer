/* eslint-disable react-hooks/exhaustive-deps */
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Box,
  Divider,
  FormControl,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { formatDate } from 'date-fns';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import * as Yup from 'yup';

import CustomLoadingButton from '../../../../components/common/CustomLoadingButton';
import ErrorMessage from '../../../../components/common/error_message/ErrorMessage';
import SelectAjax from '../../../../components/common/select_ajax/SelectAjax';
import SingleSelect from '../../../../components/common/singleselect/SingleSelect';
import PageWrapper from '../../../../components/container/PageWrapper';
import apiClient from '../../../../config/api-client';
import { ApiService } from '../../../../constants/ApiService';
import { Option } from '../../../../interfaces/ITypes';
import { store } from '../../../../store';
import { setError } from '../../../../store/error/slice';
import {
  AlumniContact,
  AlumniUpdatePayload,
  UpdateAlumniAlive,
} from '../../interface/Alumni';
import { ChildUpdatePayload } from '../../interface/Child';
import { ModalCity } from '../ModalCity';
import TableWithSimpleAction from '../table_with_simple_action/TableWithSimpleAction';
import ChildrenTable from './ChildrenTable';

const phoneRegExp = /^\+?\d{3,}$/;

const validationSchema = Yup.object().shape({
  alive: Yup.boolean().required(),
  companyName: Yup.string().notRequired(),
  companyCategoryId: Yup.string().notRequired(),
  sectorId: Yup.string().notRequired(),
  positionName: Yup.string().notRequired(),
  positionLevelId: Yup.string().notRequired(),
  jobCategoryId: Yup.string().notRequired(),
  countryId: Yup.string().notRequired(),
  provinceId: Yup.string().notRequired(),
  cityId: Yup.string().notRequired(),
  email: Yup.array()
    .of(
      Yup.object().shape({
        shown: Yup.boolean(),
        previousData: Yup.string().notRequired(),
        data: Yup.string()
          .when('shown', (shown, schema) =>
            shown[0] ? schema.required('Email is required').email() : schema
          )
          .test(
            'unique',
            'Each email must be unique.',
            // eslint-disable-next-line func-names
            function (this: Yup.TestContext, value, context) {
              if (!value) return true; // Skip validation if no value

              const emailArray = context.options.context?.email as {
                data: string;
              }[];
              const duplicateCount = emailArray.filter(
                item => item.data === value
              ).length;

              if (duplicateCount > 1) {
                const { path } = this;
                return this.createError({
                  path: `${path}`,
                  message: 'Email must be unique',
                });
              }

              return true;
            }
          )
          .email('Invalid email format'),
      })
    )
    .max(3, 'Maximum 3 email allowed'),
  phone: Yup.array()
    .of(
      Yup.object().shape({
        shown: Yup.boolean(),
        previousData: Yup.string(),
        data: Yup.string()
          .when('shown', (shown, schema) =>
            shown[0]
              ? schema
                  .required('Phone number is required')
                  .matches(phoneRegExp, 'Phone number is not valid')
              : schema
          )
          .test(
            'unique',
            'Each Phone must be unique.',
            // eslint-disable-next-line func-names
            function (this: Yup.TestContext, value, context) {
              if (!value) return true; // Skip validation if no value

              const phoneArray = context.options.context?.phone as {
                data: string;
              }[];
              const duplicateCount = phoneArray.filter(
                item => item.data === value
              ).length;

              if (duplicateCount > 1) {
                const { path } = this;
                return this.createError({
                  path: `${path}`,
                  message: 'Phone must be unique',
                });
              }

              return true;
            }
          ),
      })
    )
    .max(2, 'Maximum 2 phone number allowed'),
  child: Yup.array().of(
    Yup.object().shape({
      isCreated: Yup.boolean(),
      isUpdated: Yup.boolean(),
      isDeleted: Yup.boolean(),
      alumniChildName: Yup.string().trim().required(''),
      alumniChildDateBirth: Yup.string().trim().required('Birth '),
      alumniChildGenderId: Yup.string().trim().required(''),
      alumniChildCountryId: Yup.string().trim().required(''),
    })
  ),
});

interface UpdateAliveFormProps {
  editable: boolean;
  alumni: AlumniUpdatePayload;
  alumniEmail: AlumniContact[];
  alumniPhoneNumber: AlumniContact[];
  alumniChild: ChildUpdatePayload[];
}

export default function UpdateAliveForm({
  alumni,
  alumniEmail,
  alumniPhoneNumber,
  alumniChild,
  editable,
}: UpdateAliveFormProps) {
  const [isChildSectionOpen, setIsChildSectionOpen] = useState(false);
  const [isModalCityOpen, setIsModalCityOpen] = useState(false);

  const [countries, setCountries] = useState<Option[]>([]);
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [filteredCities, setFilteredCities] = useState<Option[]>([]);

  const Navigate = useNavigate();

  const getCountries = async () => {
    const response = await apiClient.get(ApiService.country);
    setCountries(response.data.listDropdown);
  };

  const getProvinces = async () => {
    const response = await apiClient.get(ApiService.province);
    setProvinces(response.data.listDropdown);
  };

  const getCities = async () => {
    const response = await apiClient.get(ApiService.city);
    setCities(response.data.listDropdown);
  };

  const formik = useFormik<UpdateAlumniAlive>({
    initialValues: {
      alive: true,
      companyName: alumni.companyName,
      companyCategoryId: alumni.companyCategoryId,
      sectorId: alumni.sectorId,
      positionName: alumni.positionName,
      positionLevelId: alumni.positionLevelId,
      jobCategoryId: alumni.jobCategoryId,
      countryId: alumni.countryId,
      provinceId: alumni.provinceId,
      cityId: alumni.cityId,
      email: alumniEmail,
      phone: alumniPhoneNumber,
      child: alumniChild,
    },
    validationSchema,
    onSubmit: async values => {
      try {
        if (formik.dirty === false) {
          throw new SyntaxError('Please update at least one field of data');
        }

        const payload = JSON.parse(JSON.stringify(values));

        payload.email = payload.email.filter(
          t => t.shown || t.previousData.length > 0
        );
        payload.phone = payload.phone.filter(
          t => t.shown || t.previousData.length > 0
        );
        payload.child = payload.child
          .filter(
            child => child.isCreated || child.isUpdated || child.isDeleted
          )
          .map(child => {
            const modifyChild = child;

            if (child.isCreated) {
              modifyChild.alumniChildId = '';
            }

            modifyChild.alumniChildDateBirth = formatDate(
              child.alumniChildDateBirth as string,
              'dd/MM/yyyy'
            );

            return modifyChild;
          });

        const result = await apiClient.patch(
          `${ApiService.alumni}/${alumni.alumniId}`,
          payload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (result.data.resultCode === 200) {
          store.dispatch(
            setError({
              type: 'success',
              message: 'Edit alumni request is submitted successfully',
              title: 'Success',
            })
          );

          Navigate('/update-alumni/approval');
        }
      } catch (error: unknown) {
        let errorMessage = 'Something went wrong, please try again later.';

        if (error instanceof AxiosError) {
          errorMessage = error.response?.data ?? errorMessage;
        }

        if (error instanceof SyntaxError) {
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

  const debounce = useDebouncedCallback((field, value) => {
    formik.setFieldValue(field, value);
  }, 250);

  const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const { name, value } = e.target;
    debounce(name, value);
  };

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({
    companyName: null,
    positionName: null,
  });

  useEffect(() => {
    Object.keys(inputRefs.current).forEach(key => {
      const inputRef = inputRefs.current[key];
      if (inputRef) {
        inputRef.value = formik.initialValues[key];
      }
    });

    if (formik.initialValues.countryId !== 'ID') {
      formik.setFieldValue('provinceId', '');
      formik.setFieldValue('cityId', '');
    }
  }, [formik.initialValues]);

  useEffect(() => {
    formik.setFieldValue('provinceId', '');
    formik.setFieldValue('cityId', '');
  }, [formik.values.countryId]);

  useEffect(() => {
    if (!formik.values.countryId) {
      setFilteredCities([]);
      formik.setFieldValue('cityId', '');
      return;
    }

    let filteredCity = cities.filter(e =>
      e.label.startsWith(formik.values.countryId)
    );

    if (!formik.values.provinceId) {
      filteredCity = filteredCity.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      setFilteredCities(filteredCity);
      formik.setFieldValue('cityId', '');
      return;
    }

    filteredCity = filteredCity.filter(
      e =>
        !e.label.startsWith('ID') ||
        formik.values.provinceId.includes(e.value.slice(0, 2))
    );

    filteredCity = filteredCity.sort((a, b) => a.label.localeCompare(b.label));
    setFilteredCities(filteredCity);

    if (
      filteredCity.filter(e => e.value === formik.values.cityId).length === 0
    ) {
      formik.setFieldValue('cityId', '');
    }

  }, [cities, formik.values.countryId, formik.values.provinceId]);

  useEffect(() => {
    getCountries();
    getProvinces();
    getCities();
  }, []);

  return (
    <PageWrapper>
      <ModalCity
        selectedCountryId={formik.values.countryId}
        countries={countries}
        open={isModalCityOpen}
        handleClose={() => setIsModalCityOpen(false)}
        refreshCity={getCities}
      />

      <form onSubmit={formik.handleSubmit}>
        <Box component="section" marginBottom={3}>
          <Stack direction="row" gap={3} marginBottom={2}>
            <FormControl fullWidth>
              <Typography variant="label">Company Name</Typography>

              <TextField
                inputRef={el => (inputRefs.current.companyName = el)}
                onChange={textFieldChangeHandler}
                name="companyName"
                onBlur={formik.handleBlur}
                variant="outlined"
                disabled={!editable || formik.isSubmitting}
                error={
                  formik.touched.companyName &&
                  Boolean(formik.errors.companyName)
                }
                inputProps={{ style: { fontSize: '14px' } }}
              />

              <ErrorMessage formik={formik} name="companyName" />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="label">Company Category</Typography>

              <SelectAjax
                name="companyCategoryId"
                value={formik.values.companyCategoryId}
                onChange={value =>
                  formik.setFieldValue('companyCategoryId', value)
                }
                apiEndpoint={ApiService.companyCategory}
                selectType="single"
                disabled={!editable || formik.isSubmitting}
              />

              <ErrorMessage formik={formik} name="companyCategoryId" />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="label">Sector</Typography>

              <SelectAjax
                name="sectorId"
                value={formik.values.sectorId}
                onChange={value => formik.setFieldValue('sectorId', value)}
                apiEndpoint={ApiService.sector}
                selectType="single"
                disabled={!editable || formik.isSubmitting}
              />

              <ErrorMessage formik={formik} name="sectorId" />
            </FormControl>
          </Stack>

          <Stack direction="row" gap={3}>
            <FormControl fullWidth>
              <Typography variant="label">Position</Typography>

              <TextField
                inputRef={el => (inputRefs.current.positionName = el)}
                name="positionName"
                onChange={textFieldChangeHandler}
                onBlur={formik.handleBlur}
                variant="outlined"
                size="small"
                disabled={!editable || formik.isSubmitting}
                inputProps={{ style: { fontSize: '14px' } }}
              />

              <ErrorMessage formik={formik} name="positionName" />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="label">Position Level</Typography>

              <SelectAjax
                name="positionLevelId"
                value={formik.values.positionLevelId}
                onChange={value =>
                  formik.setFieldValue('positionLevelId', value)
                }
                apiEndpoint={ApiService.positionLevel}
                selectType="single"
                disabled={!editable || formik.isSubmitting}
              />

              <ErrorMessage formik={formik} name="positionLevelId" />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="label">Job Category</Typography>

              <SelectAjax
                name="jobCategoryId"
                value={formik.values.jobCategoryId}
                onChange={value => formik.setFieldValue('jobCategoryId', value)}
                apiEndpoint={ApiService.jobCategory}
                selectType="single"
                disabled={!editable || formik.isSubmitting}
              />

              <ErrorMessage formik={formik} name="jobCategoryId" />
            </FormControl>
          </Stack>
        </Box>

        <Box component="section" marginBottom={3}>
          <Typography variant="body1" marginBottom="8px">
            Email
          </Typography>

          <TableWithSimpleAction
            label="Email"
            maxRow={3}
            formikKey="email"
            formik={formik}
            editable={editable || formik.isSubmitting}
            customValidationSchema={Yup.object().shape({
              contact: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            })}
          />
        </Box>

        <Box component="section" marginBottom={3}>
          <Typography variant="body1" marginBottom="8px">
            Phone Number
          </Typography>

          <TableWithSimpleAction
            label="Phone Number"
            maxRow={2}
            formikKey="phone"
            formik={formik}
            editable={editable || formik.isSubmitting}
            customValidationSchema={Yup.object().shape({
              contact: Yup.string()
                .matches(phoneRegExp, 'Invalid phone format')
                .required('Phone is required'),
            })}
            additionalFooterElement={
              <Typography variant="label" fontWeight={600}>
                *Please include the area code in the phone number (e.g., +62 or
                021).
              </Typography>
            }
          />
        </Box>

        <Stack direction="row" gap={3} marginBottom={4}>
          <FormControl fullWidth>
            <Typography variant="label">Country</Typography>

            <SingleSelect
              name="countryId"
              value={formik.values.countryId}
              data={countries}
              onChange={value => formik.setFieldValue('countryId', value)}
              disabled={!editable || formik.isSubmitting}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">Province (Indonesia)</Typography>

            <SingleSelect
              name="provinceId"
              data={formik.values.countryId === 'ID' ? provinces : []}
              value={formik.values.provinceId}
              onChange={value => formik.setFieldValue('provinceId', value)}
              disabled={!editable || formik.isSubmitting}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">City</Typography>

            <SingleSelect
              name="cityId"
              data={filteredCities}
              value={formik.values.cityId}
              onChange={value => formik.setFieldValue('cityId', value)}
              disabled={!editable || formik.isSubmitting}
            />
            {formik.values.countryId !== 'ID' && (
              <Link
                sx={{ cursor: 'pointer' }}
                onClick={() => setIsModalCityOpen(true)}
              >
                <Typography
                  variant="label"
                  color="primary"
                  sx={{ marginBottom: '0 !important' }}
                >
                  City Not Found?
                </Typography>
              </Link>
            )}
          </FormControl>
        </Stack>

        <Divider />

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ cursor: 'pointer' }}
          onClick={() => setIsChildSectionOpen(previousValue => !previousValue)}
        >
          <Typography variant="body1" fontWeight={600} marginY={2}>
            Child
          </Typography>

          <ExpandLessIcon
            sx={{
              fontSize: 32,
              transition: '.5s',
              transform: isChildSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>

        <Divider />

        <Box component="section" marginTop={3} hidden={!isChildSectionOpen}>
          <ChildrenTable
            childrenData={formik.values.child}
            setChildrenData={child => formik.setFieldValue('child', child)}
            editable={editable || formik.isSubmitting}
          />

          <Divider />
        </Box>

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
    </PageWrapper>
  );
}
