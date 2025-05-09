import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { 
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography} from '@mui/material';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { format, formatDate, parse } from 'date-fns';
import { useFormik } from 'formik';
import qs from 'qs';
import { useCallback, useEffect, useMemo,useState } from 'react';
import { RiFolderReceivedFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import * as XLSX from 'xlsx';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import Datepicker from '../../components/common/Datepicker';
import MultiSelect from '../../components/common/multiselect/MultiSelect';
import ServerTableAjax from '../../components/common/table_ajax/ServerTableAjax';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import { Option } from '../../interfaces/ITypes';
import { selectProfile } from '../../store/profile/selector';
import { layoutPrivateStyle } from '../../styles/layout/private-routes';
import { removeEmptyStringAndArray } from '../../utils/object-helper';
import { objectToQueryString } from '../../utils/string-helper';
import { EditTableButton } from './components/EditTableButton';
import { SearchFilters } from './Interface/ISearchFilters';
import { ExportDataType, ViewDataType } from './Interface/IViewEndowment';

const formatNumber = (input) => {
  const valueString = input?.toString().trim();

  if (valueString === '' || !valueString) {
      return '-';
  }

  if (/^0+$/.test(valueString)) {
      return '0';
  }

  const cleanedValue = valueString.replace(/^0+/, '').replace(/[\s,.]/g, '');

  const [integerPart, decimalPart] = cleanedValue.split('.');

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
};

export function ViewEndowment() {
  const [data, setData] = useState<ViewDataType[]>([]);
  const [exportData, setExportData] = useState<ExportDataType[]>([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [campusList, setCampusList] = useState<Option[]>([]);
	const [campusWatcher, setCampusWatcher ] = useState<boolean>(false);
	const [facultyList, setfacultyList] = useState<Option[]>([]);
	const [facultyWatcher, setFacultyWatcher] = useState<boolean>(false);
	const [programList, setProgramList] = useState<Option[]>([]);
	const [programWatcher, setProgramWatcher] = useState<boolean>(false);
	const [degreeList, setDegreeList] = useState<Option[]>([]);
  const [, setPartialLoading] = useState(false);
  const [endowmentCategoryList, setEndowmentCategoryList] = useState<Option[]>([]);
  const [endowmentTableFilters, setEndowmentTableFilters] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const userProfile = useSelector(selectProfile);
  const { currentRoleDetailId, rolePermissions } = userProfile;
  const [radioValue, setRadioValue] = useState('Alumni');
  const [debouncedRadioValue] = useDebounce(radioValue, 300);
  const [pagination, setPagination] = useState({
		pageIndex: 0, 
		pageSize: 10, 
	});
  const [set, reset] = useState(false);
  const Navigate = useNavigate();

  const renderEditButton = useCallback(
    (engagementId: number, proposalStatusName: string) => {
      if (proposalStatusName !== 'Approved') return null;

      return (
        <EditTableButton
          route={`/endowment/edit/${engagementId}`}
          id={engagementId}
          rolePermissions={rolePermissions}
        />
      );
    },
    [rolePermissions]
  );

  type ColumnType = ColumnDef<ViewDataType>;

  const getColumns = (): ColumnType[] => {
    const columns: ColumnType[] = [
      {
        accessorKey: 'period',
        header: 'Period',
        cell: info => formatDate(info.getValue() as string, 'dd LLLL yyyy'),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: info => formatDate(info.getValue() as string, 'dd LLLL yyyy')
      },
      {
        accessorKey: 'alumniNIM',
        header: 'NIM',
      },
      {
        accessorKey: 'alumniName',
        header: 'Name',
      },
      {
        accessorKey: 'programName',
        header: 'Program',
      },
      {
        accessorKey: 'unitName',
        header: 'Unit Name',
      },
      {
        accessorKey: 'endowmentCategoryName',
        header: 'Category',
      },
      {
        accessorKey: 'activity',
        header: 'Activity',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'debit',
        header: 'Debit',
        cell: info =>{
          const rowData = info.row.original;
          return formatNumber(rowData.debit);
        }
      },
      {
        accessorKey: 'kredit',
        header: 'Kredit',
        cell: info =>{
          const rowData = info.row.original;
          return formatNumber(rowData.kredit);
        }
      },
      {
        accessorKey: 'userIn',
        header: 'Created By',
      },
      {
        accessorKey: 'proposalStatusName',
        header: 'Status',
      },
      {
        accessorKey: 'endowmentId',
        header: 'Action',
        size: 1,
        enableSorting: false,
        cell: info => {
          const rowData = info.row.original;
          const endowmentId = info.getValue() as number;
          return renderEditButton(endowmentId, rowData.proposalStatusName);
        }, 
      }
    ];
    return columns
  };

  const columns = useMemo(() => getColumns(), []);

  const initialValues: SearchFilters = {
		campusId: [],
		facultyId: [],
		programId: [],
		degreeId: [],
    endowmentCategoryId: [],
    startDate:'',
    endDate:''
	}


  const filterInvalidValue = (value: string[], list: Option[]) => value.filter((item) => list.map(dt => dt.value).includes(item));
  const getViewEndowment = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {
      const param = {
        CampusId: formik.values.campusId,
        FacultyId: formik.values.facultyId,
        ProgramId: formik.values.programId,
        DegreeId: formik.values.degreeId,
        EndowmentCategoryId: formik.values.endowmentCategoryId,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        radioView: radioValue
      }
      const url = `${ApiService.endowment}/viewEndowment?${query}&${qs.stringify(param)}`;
      const response = await apiClient.get(url).then(e => e.data);
      setData(response.data);
      setTotalResults(response.dataCount);
      if(page){
        setPagination(page);
      }
      if(sort){
        setSorting(sort);
      }
      setTimeout(() => setPartialLoading(false), 1000);
    },[dataWatcher]
  );
  const getExportEndowment = useCallback(
    async () => {
        setLoadingExport(true);
        apiClient.get(`${ApiService.endowment}/export?userRoleDetail=${currentRoleDetailId}&radioView=${radioValue}&${endowmentTableFilters}`)
        .then(resp=>resp)
        .then(resp=>{
          setExportData(resp.data.map(item => ({
            period: item.period,
            date: item.date,
            nim: item.nim,
            name: item.name,
            campus: item.campus,
            faculty: item.faculty,
            program: item.program,
            degree: item.degree,
            unitName: item.unitName,
            category: item.category,
            debit: item.debit,
            kredit: item.kredit,
            activity: item.activity,
            description: item.description,
            status: item.status
          })));
          setLoadingExport(false);
        })
        .catch(_error => {
          setLoadingExport(false);
        })
    },[endowmentTableFilters, debouncedRadioValue]
  );
  const getCampusesByRole = useCallback(async () => {
		const param = {
			roleDetailId: currentRoleDetailId,
			facultyId: formik.values.facultyId.length > 0 ? formik.values.facultyId: [],
			programId: formik.values.programId.length > 0 ? formik.values.programId : [],
      useCurrentRole: true
		};
		const response = await apiClient.get(`${ApiService.campus}`, { params: param, paramsSerializer: p => qs.stringify(p) });
		const mappedResponse = response.data.listDropdown;
		setCampusList(mappedResponse);
		formik.setFieldValue('campusId', filterInvalidValue(formik.values.campusId, mappedResponse));
	}, [facultyWatcher, programWatcher]);
	
	const getFacultiesByRole = useCallback(async () => {
		const param = {
			roleDetailId: currentRoleDetailId,
			campusId: formik.values.campusId.length > 0 ? formik.values.campusId : [],
			programId: formik.values.programId.length > 0 ? formik.values.programId : [],
      useCurrentRole: true
		};
		const response = await apiClient.get(`${ApiService.faculty}`, { params: param, paramsSerializer: p => qs.stringify(p) });
		const mappedResponse = response.data.listDropdown;
		setfacultyList(mappedResponse);
		formik.setFieldValue('facultyId', filterInvalidValue(formik.values.facultyId, mappedResponse));
	}, [campusWatcher, programWatcher]);
	
	const getProgramsByRole = useCallback(async () => {
		const param = {
			roleDetailId: currentRoleDetailId,
			campusId: formik.values.campusId.length > 0 ? formik.values.campusId : [],
			facultyId: formik.values.facultyId.length > 0 ? formik.values.facultyId : [],
      useCurrentRole: true
		};
		const response = await apiClient.get(`${ApiService.program}`, { params: param, paramsSerializer: p => qs.stringify(p) });
		const mappedResponse = response.data.listDropdown;
		setProgramList(mappedResponse);
		formik.setFieldValue('programId', filterInvalidValue(formik.values.programId, mappedResponse));
	}, [campusWatcher, facultyWatcher]);

  const getEndowmentCategory = useCallback(async() => {
    const response = await apiClient.get(ApiService.endowmentCategory);
    const mappedResponse = response.data.map((item) => ({
      value: item.endowmentCategoryId,
      label: item.endowmentCategoryName
    }))
    setEndowmentCategoryList(mappedResponse)
    formik.setFieldValue('endowmentCategoryId', filterInvalidValue(formik.values.endowmentCategoryId, mappedResponse))
  }, []);

  const getMasterFilters = async() => {
		getCampusesByRole();
		getFacultiesByRole();
		getProgramsByRole();
    getEndowmentCategory();
		const degreesResponse = await apiClient.get(`${ApiService.degree}`);
		setDegreeList(degreesResponse.data.listDropdown);
	}

  useEffect(() => {
    getExportEndowment();
  }, [endowmentTableFilters, debouncedRadioValue]);
  useEffect(() => {
    getMasterFilters();
  },[]);
	useEffect(() => {
		getFacultiesByRole();
		getProgramsByRole();
	}, [campusWatcher]);
	useEffect(() => {
		getCampusesByRole();
		getProgramsByRole();
	}, [facultyWatcher]);
	useEffect(() => {
		getCampusesByRole();
		getFacultiesByRole();
	}, [programWatcher]);

  const refreshDropdown = (field: string) => {
		switch(field){
			case 'campus':
				setCampusWatcher(!campusWatcher);
				break;
			case 'faculty':
				setFacultyWatcher(!facultyWatcher);
				break;
			case 'program':
				setProgramWatcher(!programWatcher);
				break;
			default:
				break;
		}
	}

  const formik = useFormik<SearchFilters>({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      const values = removeEmptyStringAndArray(formik.values);
      setEndowmentTableFilters(objectToQueryString(values));
      setPagination({
        pageIndex: 0,
        pageSize: 10
      });
    },
  });
  

  const HandleExportToExcel = () => {
    setLoadingExport(true);
    const headers = ['Period', 'Date', 'NIM', 'Name', 'Campus', 'Faculty', 'Program', 'Degree', 'Unit Name', 'Category', 'Debit','Kredit', 'Activity','Description', 'Status'];
    const rows = exportData.map(item => [
      format(item.period, 'yyyy-MM-dd'),
      format(item.date, 'yyyy-MM-dd'),
      item.nim,
      item.name,
      item.campus,
      item.faculty,
      item.program,
      item.degree,
      item.unitName,
      item.category,
      item.debit,
      item.kredit,
      item.activity,
      item.description,
      item.status
    ]);
    const excelExport = [headers, ...rows];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'endowmentData.xlsx');
    setLoadingExport(false);
  }
  
  const serverTable = ServerTableAjax<ViewDataType>({
    data, 
    columns, 
		rowCount: totalResults,
		page: pagination,
		sort: sorting,
		isMultiSort: false,
		onTableChange: getViewEndowment,
		pageReset: set,
		search
	});

  const handleSearch =  useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearch(searchTerm);
		reset(!set);
  }, 1000);

  const [loading, setLoading] = useState(false);

  return (
    <PageWrapper>
      <Box component="section">
        <form onSubmit={formik.handleSubmit}>
          {rolePermissions.some(item => item.permissionName === 'view-endowment-role-option') && (
            <Stack direction='row'>
              <FormControl component='fieldset'>
                <RadioGroup
                  row
                  value={radioValue}
                  onChange={(e) => {
                    setRadioValue(e.target.value);
                    setDataWatcher(!dataWatcher);
                  }}
                >
                  <FormControlLabel
                    value='ARO'
                    control={<Radio/>}
                    label={
                      <Typography sx={{ fontWeight: 400, fontSize: '12px' }}>
                        ARO
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value='Alumni'
                    control={<Radio/>}
                    label={
                      <Typography sx={{ fontWeight: 400, fontSize: '12px' }}>
                        Alumni
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          )}
          {radioValue === 'Alumni' && (
            <>
              <Stack
                direction='row'
                width='100%'
                marginTop='20px'
              >
                <FormControl fullWidth>
                  <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>Campus</Typography>
                  <MultiSelect
                    data={campusList}
                    value={formik.values.campusId}
                    onChange={(value) => {
                      formik.setFieldValue('campusId', value);
                      refreshDropdown('campus');
                    }}
                    onClear={() => {
                      formik.setFieldValue('campusId', []);
                      refreshDropdown('campus');
                    }}
                    placeholder='Select an option'
                    sx={{width:'100%'}}
                  >
                    {campusList.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
              </Stack>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                marginTop={2}
              >
                <FormControl fullWidth>
                  <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>Faculty</Typography>
                  <MultiSelect
                    data={facultyList}
                    value={formik.values.facultyId}
                    onChange={(value) => {
                      formik.setFieldValue('facultyId', value);
                      refreshDropdown('faculty');
                    }}	
                    onClear={() => {
                      formik.setFieldValue('facultyId', []);
                      refreshDropdown('faculty');
                    }}
                    placeholder='Select an option'
                    sx={{width:'100%'}}
                  >
                    {facultyList.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
                <FormControl fullWidth>
                  <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>Program</Typography>
                  <MultiSelect
                    data={programList}
                    value={formik.values.programId}
                    onChange={(value) => {
                      formik.setFieldValue('programId', value);
                      refreshDropdown('program');
                    }}	
                    onClear={() => {
                      formik.setFieldValue('programId', []);
                      refreshDropdown('program');
                    }}
                    placeholder='Select an option'
                    sx={{width:'100%'}}
                  >
                    {programList.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
                <FormControl fullWidth>
                  <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>Degree</Typography>
                  <MultiSelect
                    data={degreeList}
                    value={formik.values.degreeId}
                    onChange={(value) => formik.setFieldValue('degreeId', value)}	
                    onClear={() => formik.setFieldValue('degreeId', [])}
                    placeholder='Select an option'
                    sx={{width:'100%'}}
                  >
                    {degreeList.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MultiSelect>
                </FormControl>
              </Stack>
            </>
          )}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            marginTop={2}
          >
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>Endowment Category</Typography>
              <MultiSelect
								data={endowmentCategoryList}
								value={formik.values.endowmentCategoryId}
								onChange={(value) => {
									formik.setFieldValue('endowmentCategoryId', value);
								}}	
								onClear={() => {
									formik.setFieldValue('endowmentCategoryId', []);
								}}
                placeholder='Select an option'
                sx={{width:'100%'}}
							>
								{endowmentCategoryList.map((item) => (
									<MenuItem key={item.value} value={item.value}>
										{item.label}
									</MenuItem>
								))}
							</MultiSelect>
            </FormControl>
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>Start Date</Typography>
                <Datepicker 
                  value={formik.values.startDate}
                  onChange={(item) => {
                      formik.setFieldValue('startDate', item);
                  }}
                  dateFormat="dd-MM-yyyy"
                  clearIcon
                  autoClose
                />
            </FormControl>
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: 400, fontSize: '12px', marginBottom:'15px' }}>End Date</Typography>
                <Datepicker 
                  value={formik.values.endDate}
                  onChange={(item) => {
                    formik.setFieldValue('endDate', item);
                  }}
                  dateFormat="dd-MM-yyyy"
                  clearIcon
                  autoClose
                />
            </FormControl>
          </Stack>
          <Stack direction='row' gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
            {rolePermissions.some(item => item.permissionName === 'add-endowment') && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon fontSize='large'/>}
                  onClick={() => Navigate('/endowment/add')}
                >
                  <Typography sx={{fontSize:'13px', fontWeight:600}}>
                    Add
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<UploadFileIcon />}
                  onClick={() => Navigate('/endowment/import')}
                >
                  <Typography sx={{fontSize:'13px', fontWeight:600}}>
                    Import
                  </Typography>
                </Button>
              </>
            )}
            <Box sx={{flexGrow: 1}}/>
            <CustomLoadingButton type="submit" loading={loading} onClick={() => {
              reset(!set);
              setDataWatcher(!dataWatcher);
            }}>
              <Typography sx={{fontSize:'13px', fontWeight:600}}>
                Apply
              </Typography>
            </CustomLoadingButton>
          </Stack>
        </form>
      </Box>
      <Divider sx={{marginY: "20px"}}/>
      <Stack direction='row' gap='10px' sx={{width: '100%'}} marginBottom={2}>
        {rolePermissions.some(item => item.permissionName === 'export-endowment') && (
          <CustomLoadingButton
            loading={loadingExport}
            variant="contained"
            color="success"
            sx={{...layoutPrivateStyle.modalChangeButton, width:'100px'}}
            size='medium'
            startIcon={<RiFolderReceivedFill style={{transform:'scaleX(-1)'}}/>}
            onClick={HandleExportToExcel}
          >
            <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>EXPORT</Typography>
          </CustomLoadingButton>
        )}
        <Box sx={{flexGrow: 1}}/>
          <Typography sx={{marginY: 'auto', fontSize:'14px', fontWeight:400}}>Search: </Typography>
          <TextField 
            variant="outlined" 
            onChange={(e) => handleSearch(e)}
            placeholder='Search By'
          />
      </Stack>
      <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2}}>
        {serverTable}
      </Stack>
    </PageWrapper>
  );
}