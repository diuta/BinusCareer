/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datepicker/dist/react-datepicker.css';

import {
  Box,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CellContext,
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import qs from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { BiSolidFileExport } from 'react-icons/bi';
import { useDebouncedCallback } from 'use-debounce';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import MultiSelect from '../../components/common/multiselect/MultiSelect';
import RangeYearpicker from '../../components/common/RangeYearpicker';
import ServerTableAjax from '../../components/common/table_ajax/ServerTableAjax';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import { Option } from '../../interfaces/ITypes';
import { store } from '../../store';
import { setError } from '../../store/error/slice';
import { AlumniContact } from '../alumni-update/interface/Alumni';
import { FilterDataBlast, ListDataBlast } from './Interface';

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

const renderContactCell = (
  info: CellContext<ListDataBlast, unknown>,
  index: number
) => {
  const value = info.getValue() as AlumniContact[];
  const selectedValue = value[index] ?? {};

  return (
    <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
      {selectedValue.data ?? '-'}
    </Typography>
  );
};

const columns: ColumnDef<ListDataBlast>[] = [
  {
    accessorKey: 'alumniNIM',
    header: 'NIM',
    size: 10,
  },
  {
    accessorKey: 'alumniName',
    header: 'Name',
    size: 120,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    id: 'email_1',
    size: 300,
    enableSorting: false,
    cell: info => renderContactCell(info, 0),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    id: 'phone_1',
    size: 300,
    enableSorting: false,
    cell: info => renderContactCell(info, 0),
  },
];

export function DataBlastPage() {
  const [searchValue, setSearchValue] = useState('');
  const [alumniBlastData, setAlumniBlastData] = useState<ListDataBlast[]>([]);

  const [campusList, setCampusList] = useState<Option[]>([]);
  const [facultyList, setFacultyList] = useState<Option[]>([]);
  const [programList, setProgramList] = useState<Option[]>([]);
  const [countries, setCountries] = useState<Option[]>([]);
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [degrees, setDegrees] = useState<Option[]>([]);
  const [graduationPeriod, setGraduationPeriod] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [filteredCities, setFilteredCities] = useState<Option[]>([]);

  const [selectedCampus, setSelectedCampus] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedEntryYear, setSelectedEntryYear] = useState<number[]>([]);
  const [selectedGraduationYear, setSelectedGraduationYear] = useState<
    number[]
  >([]);
  const [selectedGraduationPeriod, setSelectedGraduationPeriod] = useState<
    string[]
  >([]);
  const [alumniBlastParams, setAlumniBlastParams] = useState<FilterDataBlast>();

  const [selectWatcher, setSelectWatcher] = useState<string>('');
  const [campusFacultyProgramOrder, setCampusFacultyProgramOrder] = useState<
    string[]
  >([]);

  const [rowCount, setRowCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageReset, setPageReset] = useState(false);

  const [loadingApply, setLoadingApply] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [isExportProhibited, setIsExportProhibited] = useState(true);
  const [stopPolling, setStopPolling] = useState(false);
  const [includeID, setIncludeID] = useState<boolean>(false);

  const getJobStatus = async () => {
    const exportTaskId = localStorage.getItem('datablast-export-taskid');

    if (!exportTaskId) {
      setIsExportProhibited(false);
      setStopPolling(true);

      return;
    }

    try {
      const response = await apiClient.get(
        `${ApiService.hangfire}/job-status/${exportTaskId}`
      );

      const result = await response.data.name;

      if (result === 'Awaiting' || result === 'Processing') {
        return;
      }

      setStopPolling(true);
      setIsExportProhibited(false);
      localStorage.removeItem('datablast-export-taskid');

      const isSuccess = result === 'Succeeded';

      store.dispatch(
        setError({
          type: isSuccess ? 'success' : 'failed',
          message: `Export ${
            isSuccess
              ? 'Successful! The data has been successfully exported and sent to your email'
              : 'Failed'
          }. Please check your inbox for the details`,
          title: isSuccess ? 'Success' : 'Failed',
        })
      );
    } catch (error) {
      console.log(`Error occured ${error}`);
    }
  };

  useEffect(() => {
    getJobStatus();

    const intervalId = setInterval(() => {
      if (!stopPolling) {
        getJobStatus();
      } else {
        clearInterval(intervalId);
      }
    }, 10_000);

    return () => clearInterval(intervalId);
  }, [stopPolling]);

  useEffect(() => {
    if (!selectedCountries?.includes('ID')) {
      setSelectedProvinces([]);
      setSelectedCities([]);
      setIncludeID(false);
    } else {
      setIncludeID(true);
    }
  }, [selectedCountries]);

  useEffect(() => {
    if (!selectedCountries || selectedCountries.length <= 0) {
      setFilteredCities([]);
      setSelectedCities([]);
      return;
    }

    let filteredCity = new Array<Option>();
    selectedCountries.forEach(id => {
      filteredCity.push(...cities.filter(e => e.label.startsWith(id)));
    });

    if (!selectedProvinces || selectedProvinces.length <= 0) {
      filteredCity = filteredCity.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      setFilteredCities(filteredCity);
      setSelectedCities([]);
      return;
    }

    filteredCity = filteredCity.filter(
      e =>
        !e.label.startsWith('ID') ||
        selectedProvinces.includes(e.value.slice(0, 2))
    );

    filteredCity = filteredCity.sort((a, b) => a.label.localeCompare(b.label));
    setFilteredCities(filteredCity);
    setSelectedCities(filterInvalidValue(selectedCities ?? [], filteredCity));
  }, [selectedCountries, selectedProvinces]);

  useEffect(() => {
    getCampuses();
    getFaculties();
    getPrograms();
    getCountryData();
    getProvinces();
    getDegreeData();
    getGraduationPeriodData();
    getCities();
  }, []);

  const handleExport = async () => {
    if (isExportProhibited) {
      store.dispatch(
        setError({
          type: 'info',
          message: `The export request is currently in progress. A new request can be made after the current one is completed.`,
          title: 'Please Wait',
        })
      );

      return;
    }

    setLoadingExport(true);

    try {
      const response = await apiClient.get(
        `${ApiService.dataBlast}/export?${qs.stringify(
          alumniBlastParams
        )}&search=${searchValue}`
      );

      localStorage.setItem('datablast-export-taskid', response.data);

      setIsExportProhibited(true);
      setStopPolling(false);
      getJobStatus();

      store.dispatch(
        setError({
          type: 'success',
          message: `Your Export Request is being processed, you will be notified once it is ready.`,
          title: 'Success',
        })
      );
    } catch {
      store.dispatch(
        setError({
          type: 'failed',
          message: 'Export failed. Please try again.',
          title: 'Failed',
        })
      );
    }

    setLoadingExport(false);
  };

  const getAlumniBlastData = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      setLoadingApply(true);
      const url = `${ApiService.dataBlast}?${query}&${qs.stringify(
        alumniBlastParams
      )}`;
      const response = await apiClient.get(url).then(e => e.data);
      setAlumniBlastData(response.data);
      setRowCount(response.dataCount);
      if (page) setPagination(page);
      if (sort) setSorting(sort);
      setLoadingApply(false);
    },
    [alumniBlastParams]
  );

  const serverTable = ServerTableAjax<ListDataBlast>({
    data: alumniBlastData,
    columns,
    rowCount,
    page: pagination,
    sort: sorting,
    isMultiSort: false,
    onTableChange: getAlumniBlastData,
    pageReset,
    search: searchValue,
  });

  const handleApplyFilter = async () => {
    const params: FilterDataBlast = {
      entryYear: selectedEntryYear,
      graduationYear: selectedGraduationYear,
      listCampus: selectedCampus,
      listFaculty: selectedFaculty,
      listProgram: selectedProgram,
      listCity: selectedCities,
      listDegree: selectedDegree,
      listCountry: selectedCountries,
      listProvince: selectedProvinces,
      listGraduationPeriod: selectedGraduationPeriod,
    };
    setAlumniBlastParams(params);
  };

  const getDegreeData = async () => {
    const response = await apiClient.get(ApiService.degree);
    setDegrees(response.data.listDropdown);
  };

  const getGraduationPeriodData = async () => {
    const response = await apiClient.get(ApiService.graduationPeriod);
    setGraduationPeriod(response.data.listDropdown);
  };

  const getCountryData = async () => {
    const response = await apiClient.get(ApiService.country);
    setCountries(response.data.listDropdown);
  };

  const getProvinces = async () => {
    try {
      const response = await apiClient.get(ApiService.province);
      setProvinces(response.data.listDropdown);
    } catch (error) {
      console.error('Error fetching province data:', error);
    }
  };

  const getCities = async () => {
    try {
      const response = await apiClient.get(ApiService.city);
      setCities(response.data.listDropdown);
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const searchTerm = e.target.value.toLowerCase();
      setSearchValue(searchTerm);
    },
    1000
  );

  const handleEntryDateChange = date => {
    setSelectedEntryYear(date);
  };

  const handleGraduationYearChange = date => {
    setSelectedGraduationYear(date);
  };

  const filterInvalidValue = (value: string[], list: Option[]) =>
    value.filter(item => list.map(dt => dt.value).includes(item));

  const getCampuses = useCallback(
    async (filterParams?: { faculty: boolean; program: boolean }) => {
      const params = {
        facultyId: filterParams?.faculty ? selectedFaculty : [],
        programId: filterParams?.program ? selectedProgram : [],
        useCurrentRole: true,
      };
      const response = await apiClient.get(ApiService.campus, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });
      const mappedResponse = response.data.listDropdown;
      setCampusList(mappedResponse);

      const filteredValue = filterInvalidValue(selectedCampus, mappedResponse);

      if (filteredValue.length !== selectedCampus.length) {
        setSelectWatcher(CAMPUS_ORDER_KEY);
      }

      setSelectedCampus(filteredValue);
    },
    [selectWatcher]
  );

  const getFaculties = useCallback(
    async (filterParams?: { campus: boolean; program: boolean }) => {
      const params = {
        campusId: filterParams?.campus ? selectedCampus : [],
        programId: filterParams?.program ? selectedProgram : [],
        useCurrentRole: true,
      };

      const response = await apiClient.get(ApiService.faculty, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });
      const mappedResponse = response.data.listDropdown;
      setFacultyList(mappedResponse);

      const filteredValue = filterInvalidValue(selectedFaculty, mappedResponse);

      setSelectedFaculty(filteredValue);
    },
    [selectWatcher]
  );

  const getPrograms = useCallback(
    async (filterParams?: { faculty: boolean; campus: boolean }) => {
      const params = {
        campusId: filterParams?.campus ? selectedCampus : [],
        facultyId: filterParams?.faculty ? selectedFaculty : [],
        useCurrentRole: true,
      };
      const response = await apiClient.get(ApiService.program, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });

      const mappedResponse = response.data.listDropdown;

      setProgramList(mappedResponse);

      const filteredValue = filterInvalidValue(selectedProgram, mappedResponse);

      setSelectedProgram(filteredValue);
    },
    [selectWatcher]
  );

  useEffect(() => {
    if (selectWatcher === '') return;

    let selectedValues: string[] = [];

    switch (selectWatcher) {
      case CAMPUS_ORDER_KEY: {
        selectedValues = selectedCampus;

        break;
      }
      case FACULTY_ORDER_KEY: {
        selectedValues = selectedFaculty;

        break;
      }
      case PROGRAM_ORDER_KEY: {
        selectedValues = selectedProgram;

        break;
      }
    }

    const newestKeyOrder = handleKeyOrder(
      selectedValues,
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
      (selectWatcher !== CAMPUS_ORDER_KEY || selectedValues.length === 0) &&
      selectedOrder <= campusOrder
    ) {
      getCampuses({
        program: campusOrder > programOrder,
        faculty: campusOrder > facultyOrder,
      });
    }

    if (
      (selectWatcher !== FACULTY_ORDER_KEY || selectedValues.length === 0) &&
      selectedOrder <= facultyOrder
    ) {
      getFaculties({
        program: facultyOrder > programOrder,
        campus: facultyOrder > campusOrder,
      });
    }

    if (
      (selectWatcher !== PROGRAM_ORDER_KEY || selectedValues.length === 0) &&
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
    setPageReset(prev => !prev);
  }, [searchValue]);

  return (
    <PageWrapper>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap="10px"
        sx={{ width: '100%', paddingTop: '20px' }}
      >
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Campus</Typography>
          <MultiSelect
            value={selectedCampus}
            data={campusList}
            onChange={value => {
              setSelectedCampus(value);
              setSelectWatcher(CAMPUS_ORDER_KEY);
            }}
          />
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Faculty</Typography>
          <MultiSelect
            value={selectedFaculty}
            data={facultyList}
            onChange={value => {
              setSelectedFaculty(value);
              setSelectWatcher(FACULTY_ORDER_KEY);
            }}
          />
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Program</Typography>
          <MultiSelect
            value={selectedProgram}
            data={programList}
            onChange={value => {
              setSelectedProgram(value);
              setSelectWatcher(PROGRAM_ORDER_KEY);
            }}
          />
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap="10px"
        sx={{ width: '100%', paddingTop: '20px' }}
      >
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Degree</Typography>
          <MultiSelect
            value={selectedDegree}
            data={degrees}
            onChange={value => {
              setSelectedDegree(value as string[]);
            }}
          >
            {degrees.map(degree => (
              <MenuItem
                key={degree.value}
                value={degree.label}
                sx={{ fontSize: '14px' }}
              >
                {degree.label}
              </MenuItem>
            ))}
          </MultiSelect>
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Entry Year</Typography>
          <RangeYearpicker
            value={selectedEntryYear}
            onChange={handleEntryDateChange}
            id="entryYear"
            clearIcon
          />
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Graduation Year</Typography>
          <RangeYearpicker
            value={selectedGraduationYear}
            onChange={handleGraduationYearChange}
            id="entryYear"
            clearIcon
          />
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Graduation Period</Typography>
          <MultiSelect
            value={selectedGraduationPeriod}
            data={graduationPeriod}
            onChange={value => {
              setSelectedGraduationPeriod(value as string[]);
            }}
          >
            {graduationPeriod.map(item => (
              <MenuItem
                key={item.value}
                value={item.label}
                sx={{ fontSize: '14px' }}
              >
                {item.label}
              </MenuItem>
            ))}
          </MultiSelect>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap="10px"
        sx={{ width: '100%', paddingTop: '20px' }}
      >
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Country</Typography>
          <MultiSelect
            data={countries}
            value={selectedCountries}
            onChange={value => {
              setSelectedCountries(value);
            }}
          />
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">Province (Indonesia)</Typography>

          <MultiSelect
            data={includeID ? provinces : []}
            value={selectedProvinces}
            onChange={value => {
              setSelectedProvinces(value);
            }}
          />
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Typography variant="label">City</Typography>

          <MultiSelect
            data={filteredCities}
            value={selectedCities}
            onChange={value => setSelectedCities(value)}
          />
        </Stack>
      </Stack>
      <Stack sx={{ paddingTop: '20px' }} alignItems="end">
        <CustomLoadingButton
          loading={loadingApply}
          onClick={handleApplyFilter}
          color="primary"
          sx={{ fontSize: '13px' }}
        >
          Apply
        </CustomLoadingButton>
      </Stack>
      <Divider sx={{ marginY: '20px' }} />

      <Stack gap="15px">
        <Stack
          direction="row"
          alignItems="center"
          gap="10px"
          justifyContent="space-between"
        >
          <CustomLoadingButton
            loading={loadingExport}
            startIcon={<BiSolidFileExport />}
            variant="contained"
            color="success"
            sx={{ width: '100px', fontSize: '13px' }}
            onClick={handleExport}
          >
            export
          </CustomLoadingButton>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
              Search:
            </Typography>
            <TextField id="Search By" onChange={handleSearch} size="small" />
          </Box>
        </Stack>

        <Paper sx={{ width: '100%', mb: 2 }}>{serverTable}</Paper>
      </Stack>
    </PageWrapper>
  );
}
