/* eslint-disable func-names */
/* eslint-disable react-hooks/exhaustive-deps */
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Box,
  Button,
  Card,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import qs from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { object, string } from 'yup';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import Datepicker from '../../components/common/Datepicker';
import ErrorMessage from '../../components/common/error_message/ErrorMessage';
import MultiSelect from '../../components/common/multiselect/MultiSelect';
import RangeYearpicker from '../../components/common/RangeYearpicker';
import SelectAjax from '../../components/common/select_ajax/SelectAjax';
import SingleSelect from '../../components/common/singleselect/SingleSelect';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import { Option } from '../../interfaces/ITypes';
import AlumniTable from './components/AlumniTable';
import { FilterAlumniList } from './interface/Form';

const searhFilter = [
  {
    value: 'nim',
    label: 'Nim',
  },
  {
    value: 'name',
    label: 'Name',
  },
];

const CAMPUS_ORDER_KEY = 'campusId';
const FACULTY_ORDER_KEY = 'facultyId';
const PROGRAM_ORDER_KEY = 'programId';

const handleKeyOrder = (
  changedValue: string[],
  keys: string,
  prevSelectedOrder: string[]
) => {
  if (changedValue.length === 0) {
    return prevSelectedOrder.filter(filter => filter !== keys);
  }

  if (!prevSelectedOrder.includes(keys)) {
    return [...prevSelectedOrder, keys];
  }

  return prevSelectedOrder;
};

const getKeyIndex = (order: string[], ...args: string[]) => {
  const defaultValue = 100;

  return args.map(key =>
    order.includes(key) ? order.indexOf(key) : defaultValue
  );
};

const initialValues: FilterAlumniList = {
  filterBy: '',
  filterInput: '',
  campusId: [],
  facultyId: [],
  programId: [],
  degreeId: [],
  dateOfBirth: null,
  entryYear: [],
  graduationYear: [],
};
const validationSchema = object().shape({
  filterBy: string()
    .nullable()
    .test('filterBy-required', 'Search By is required', function (value) {
      const { filterInput } = this.parent;
      if (filterInput && filterInput.length > 0) {
        return Boolean(value);
      }
      return true;
    }),
  filterInput: string()
    .nullable()
    .test('filterInput-required', 'Input is required', function (value) {
      const { filterBy } = this.parent;
      if (filterBy && filterBy.length > 0) {
        return Boolean(value);
      }
      return true;
    }),
});

export function Index() {
  const [campusList, setCampusList] = useState<Option[]>([]);
  const [facultyList, setFacultyList] = useState<Option[]>([]);
  const [programList, setProgramList] = useState<Option[]>([]);
  const [selectWatcher, setSelectWatcher] = useState<string>('');
  const [campusFacultyProgramOrder, setCampusFacultyProgramOrder] = useState<
    string[]
  >([]);

  const [alumniTableFilters, setAlumniTableFilters] = useState(initialValues);

  const Navigate = useNavigate();

  const formik = useFormik<FilterAlumniList>({
    initialValues,
    onSubmit: (values, { resetForm }) => {
      setAlumniTableFilters(values);
      resetForm({ values });
    },
    validationSchema,
  });

  const filterInvalidValue = (value: string[], list: Option[]) =>
    value.filter(item => list.map(dt => dt.value).includes(item));

  const getCampuses = useCallback(
    async (filterParams?: { faculty: boolean; program: boolean }) => {
      const params = {
        facultyId: filterParams?.faculty ? formik.values.facultyId : [],
        programId: filterParams?.program ? formik.values.programId : [],
        useCurrentRole: true,
      };
      const response = await apiClient.get(ApiService.campus, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });
      const mappedResponse = response.data.listDropdown;
      setCampusList(mappedResponse);

      const filteredValue = filterInvalidValue(
        formik.values.campusId,
        mappedResponse
      );

      if (filteredValue.length !== formik.values.campusId.length) {
        setSelectWatcher(CAMPUS_ORDER_KEY);
      }
      formik.setFieldValue('campusId', filteredValue);
    },
    [selectWatcher]
  );

  const getFaculties = useCallback(
    async (filterParams?: { campus: boolean; program: boolean }) => {
      const params = {
        campusId: filterParams?.campus ? formik.values.campusId : [],
        programId: filterParams?.program ? formik.values.programId : [],
        useCurrentRole: true,
      };

      const response = await apiClient.get(ApiService.faculty, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });
      const mappedResponse = response.data.listDropdown;
      setFacultyList(mappedResponse);

      const filteredValue = filterInvalidValue(
        formik.values.facultyId,
        mappedResponse
      );

      formik.setFieldValue('facultyId', filteredValue);
    },
    [selectWatcher]
  );

  const getPrograms = useCallback(
    async (filterParams?: { faculty: boolean; campus: boolean }) => {
      const params = {
        campusId: filterParams?.campus ? formik.values.campusId : [],
        facultyId: filterParams?.faculty ? formik.values.facultyId : [],
        useCurrentRole: true,
      };
      const response = await apiClient.get(ApiService.program, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });

      const mappedResponse = response.data.listDropdown;

      setProgramList(mappedResponse);

      const filteredValue = filterInvalidValue(
        formik.values.programId,
        mappedResponse
      );

      formik.setFieldValue('programId', filteredValue);
    },
    [selectWatcher]
  );

  // Utility Section
  const debounce = useDebouncedCallback((field, value) => {
    formik.setFieldValue(field, value);
    setDisableButton(false);
  }, 250);

  const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setDisableButton(true);
    const { name, value } = e.target;
    debounce(name, value);
  };

  useEffect(() => {
    if (selectWatcher === '') return;

    const newestKeyOrder = handleKeyOrder(
      formik.values[selectWatcher],
      selectWatcher,
      campusFacultyProgramOrder
    );

    const [facultyOrder, campusOrder, programOrder] = getKeyIndex(
      newestKeyOrder,
      FACULTY_ORDER_KEY,
      CAMPUS_ORDER_KEY,
      PROGRAM_ORDER_KEY
    );

    const [selectedOrder] = getKeyIndex(
      campusFacultyProgramOrder,
      selectWatcher
    );

    if (
      (selectWatcher !== CAMPUS_ORDER_KEY ||
        formik.values[selectWatcher].length === 0) &&
      selectedOrder <= campusOrder
    ) {
      getCampuses({
        program: campusOrder > programOrder,
        faculty: campusOrder > facultyOrder,
      });
    }

    if (
      (selectWatcher !== FACULTY_ORDER_KEY ||
        formik.values[selectWatcher].length === 0) &&
      selectedOrder <= facultyOrder
    ) {
      getFaculties({
        program: facultyOrder > programOrder,
        campus: facultyOrder > campusOrder,
      });
    }

    if (
      (selectWatcher !== PROGRAM_ORDER_KEY ||
        formik.values[selectWatcher].length === 0) &&
      selectedOrder <= programOrder
    ) {
      getPrograms({
        campus: programOrder > campusOrder,
        faculty: programOrder > facultyOrder,
      });
    }

    setCampusFacultyProgramOrder(newestKeyOrder);
    setSelectWatcher('');
  }, [selectWatcher]);

  useEffect(() => {
    getPrograms();
    getCampuses();
    getFaculties();
  }, []);

  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  return (
    <PageWrapper>
      <Box component="section" marginBottom={2}>
        <form onSubmit={formik.handleSubmit}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          marginBottom={2}
        >
          <FormControl fullWidth>
            <Typography variant="label">Search By</Typography>

            <SingleSelect
              name="filterBy"
              value={formik.values.filterBy}
              data={searhFilter}
              onChange={value => {
                formik.setFieldValue('filterBy', value);
              }}
            />

            <ErrorMessage name="filterBy" formik={formik} />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">Input</Typography>

            <TextField
              name="filterInput"
              onChange={textFieldChangeHandler}
              onBlur={formik.handleBlur}
              variant="outlined"
            />

            <ErrorMessage name="filterInput" formik={formik} />
          </FormControl>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          marginBottom={2}
        >
          <FormControl fullWidth>
            <Typography variant="label">Campus</Typography>

            <MultiSelect
              name="campusId"
              value={formik.values.campusId}
              data={campusList}
              onChange={value => {
                formik.setFieldValue('campusId', value);
                setSelectWatcher(CAMPUS_ORDER_KEY);
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">Faculty</Typography>

            <MultiSelect
              name="facultyId"
              value={formik.values.facultyId}
              data={facultyList}
              onChange={value => {
                formik.setFieldValue('facultyId', value);
                setSelectWatcher(FACULTY_ORDER_KEY);
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">Program</Typography>

            <MultiSelect
              name="programId"
              value={formik.values.programId}
              data={programList}
              onChange={value => {
                formik.setFieldValue('programId', value);
                setSelectWatcher(PROGRAM_ORDER_KEY);
              }}
            />
          </FormControl>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          marginBottom={2}
        >
          <FormControl fullWidth>
            <Typography variant="label">Degree</Typography>

            <SelectAjax
              name="degreeId"
              value={formik.values.degreeId}
              onChange={value => formik.setFieldValue('degreeId', value)}
              apiEndpoint={ApiService.degree}
              selectType="multiple"
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">Date Of Birth</Typography>
            <Datepicker
              value={formik.values.dateOfBirth}
              onChange={date => formik.setFieldValue('dateOfBirth', date)}
              id="dateOfBirth"
              name="dateOfBirth"
              clearIcon
              autoClose
            />
          </FormControl>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          marginBottom={2}
        >
          <FormControl fullWidth>
            <Typography variant="label">Entry Year</Typography>

            <RangeYearpicker
              value={formik.values.entryYear}
              onChange={date => formik.setFieldValue('entryYear', date)}
              id="entryYear"
              clearIcon
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="label">Graduation Year</Typography>
            <RangeYearpicker
              value={formik.values.graduationYear}
              onChange={date => formik.setFieldValue('graduationYear', date)}
              id="graduationYear"
              clearIcon
            />
          </FormControl>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            color="success"
            startIcon={<UploadFileIcon />}
            onClick={() => Navigate('/update-alumni/import')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              color="white"
              variant="label"
              fontSize="13px"
              sx={{ marginBottom: '0 !important' }}
            >
              Import
            </Typography>
          </Button>

          <CustomLoadingButton
            type="submit"
            loading={loading}
            disabled={disableButton}
          >
            <Typography color="white" fontSize="13px">
              Apply
            </Typography>
          </CustomLoadingButton>
        </Stack>
        </form>
      </Box>

      <Box component="section">
        <Card variant="outlined">
          <Box p={2}>
            <AlumniTable
              filters={alumniTableFilters}
              handleParentLoading={setLoading}
            />
          </Box>
        </Card>
      </Box>
    </PageWrapper>
  );
}
