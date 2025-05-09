import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { 
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Stack,
  TextField,
  Typography} from '@mui/material';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { format, formatDate } from 'date-fns';
import { useFormik } from 'formik';
import qs from 'qs';
import { useCallback, useEffect, useMemo,useState } from 'react';
import { RiFolderReceivedFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import * as XLSX from 'xlsx';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
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
import { ExportDataType, ViewDataType } from './Interface/IViewEngagement';

const formatNumber = (numberString: string | number) => {
  const valueString = numberString.toString().trim();
  
  if (valueString === '') {
      return '';
  }

  const [integerPart, decimalPart] = valueString.split('.');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
};

export function ViewEngagement() {
  const [data, setData] = useState<ViewDataType[]>([]);
  const [originalData, setOriginalData] = useState<ViewDataType[]>([]);
  const [exportData, setExportData] = useState<ExportDataType[]>([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [campusList, setCampusList] = useState<Option[]>([]);
	const [campusWatcher, setCampusWatcher ] = useState<boolean>(false);
	const [facultyList, setfacultyList] = useState<Option[]>([]);
	const [facultyWatcher, setFacultyWatcher] = useState<boolean>(false);
  const [, setPartialLoading] = useState(false);
	const [programList, setPogramList] = useState<Option[]>([]);
	const [programWatcher, setProgramWatcher] = useState<boolean>(false);
	const [degreeList, setDegreeList] = useState<Option[]>([]);
  const [engagementTableFilters, setEngagementTableFilters] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const userProfile = useSelector(selectProfile);
  const { currentRoleDetailId, rolePermissions } = userProfile;
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
          route={`/engagement/edit/${engagementId}`}
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
      cell: info => formatDate(info.getValue() as string, 'dd LLLL yyyy'),
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
      accessorKey: 'engagementCategoryName',
      header: 'Category',
    },
    {
      accessorKey: 'engagementCategoryDetailName',
      header: 'Category Detail',
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
      accessorKey: 'nominal',
      header: 'Nominal',
      cell: info => {
        const rowData = info.row.original;
        return formatNumber(rowData.nominal);
      },
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
        accessorKey: 'engagementId',
        header: 'Action',
        size: 1,
        enableSorting: false,
        cell: info => {
            const rowData = info.row.original;
            const engagementId = info.getValue() as number;
            return renderEditButton(engagementId, rowData.proposalStatusName);
        }, 
    },
  ];
    return columns;
  };
  const columns = useMemo(() => getColumns(), []);

  const initialValues: SearchFilters = {
		campusId: [],
		facultyId: [],
		programId: [],
		degreeId: [],
	}


  const filterInvalidValue = (value: string[], list: Option[]) => value.filter((item) => list.map(dt => dt.value).includes(item));
  const getViewEngagement = useCallback(  
    async (query: string, sort?: SortingState, page?: PaginationState) => {
        const param = {
          CampusId: formik.values.campusId,
          FacultyId: formik.values.facultyId,
          ProgramId: formik.values.programId,
          DegreeId: formik.values.degreeId,
        };
        const url = `${ApiService.engagement}/viewEngagement?${query}&${qs.stringify(param)}`;
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
  const getExportEngagement = useCallback(
    async () => {
        setLoadingExport(true);
        apiClient.get(`${ApiService.engagement}/export?userRoleDetail=${currentRoleDetailId}&${engagementTableFilters}`)
        .then(resp=>resp)
        .then(resp=>{
            setExportData(resp.data);
            setLoadingExport(false);
        })
        .catch(_error =>{
          setLoadingExport(false);
        })
    },[engagementTableFilters]
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
		setPogramList(mappedResponse);
		formik.setFieldValue('programId', filterInvalidValue(formik.values.programId, mappedResponse));
	}, [campusWatcher, facultyWatcher]);

  const getMasterFilters = async() => {
		getCampusesByRole();
		getFacultiesByRole();
		getProgramsByRole();

		const degreesResponse = await apiClient.get(`${ApiService.degree}`);
		setDegreeList(degreesResponse.data.listDropdown);
	}
  useEffect(() => {
    getExportEngagement();
  }, [engagementTableFilters]);
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
      setEngagementTableFilters(objectToQueryString(values));
      setPagination({
        pageIndex: 0,
        pageSize: 10
      });
    },
  });

  const HandleExportToExcel = () => {
    setLoadingExport(true);
    const workbook = XLSX.utils.book_new();
    const headers = ['Period', 'Date', 'NIM', 'Name', 'Campus', 'Faculty', 'Program', 'Degree', 'Unit Name', 'Category', 'Category Detail', 'Nominal', 'Activity', 'Link Evidence','Description', 'Status'];
    const rows = exportData.map(item => [
      format(item.period, "yyyy-MM-dd"),
      format(item.date, "yyyy-MM-dd"),
      item.nim,
      item.name,
      item.campus,
      item.faculty,
      item.program,
      item.degree,
      item.unitName,
      item.category,
      item.categoryDetail,
      item.nominal,
      item.activity,
      item.linkEvidence,
      item.description,
      item.status
    ]);
    const excelExport = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(excelExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'engagementData.xlsx');
    setLoadingExport(false);
  }


  const serverTable = ServerTableAjax<ViewDataType>({
    data, 
    columns, 
		rowCount: totalResults,
		page: pagination,
		sort: sorting,
		isMultiSort: false,
		onTableChange: getViewEngagement,
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
          <Stack
            direction='row'
            width='100%'
          >
            <FormControl fullWidth>
              <Typography sx={{fontWeight: 400, fontSize: '12px', marginBottom:'15px'}}>Campus</Typography>
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
              <Typography sx={{fontWeight: 400, fontSize: '12px', marginBottom:'15px'}}>Faculty</Typography>
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
              <Typography sx={{fontWeight: 400, fontSize: '12px', marginBottom:'15px'}}>Program</Typography>
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
              <Typography sx={{fontWeight: 400, fontSize: '12px', marginBottom:'15px'}}>Degree</Typography>
              <MultiSelect
									data={degreeList}
									value={formik.values.degreeId}
									onChange={(value) => formik.setFieldValue('degreeId', value)}	
									onClear={() => formik.setFieldValue('degreeId', [])}
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
          <Stack direction='row' gap='10px' sx={{width: '100%', paddingTop: '20px'}}>
            {rolePermissions.some(item => item.permissionName === 'add-engagement') && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon fontSize='large'/>}
                  onClick={() => Navigate('/engagement/add')}
                >
                  <Typography sx={{fontSize:'13px', fontWeight:600}}>
                    Add
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<UploadFileIcon />}
                  onClick={() => Navigate('/engagement/import')}
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
        {rolePermissions.some(item => item.permissionName == 'export-engagement') && (
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
          />
      </Stack>
      {loading && originalData.length === 0 ? (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '400px' }}
        >
            <CircularProgress />
        </Stack>
      ) : (
        <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2}}>
          {serverTable}
        </Stack>
      )}
    </PageWrapper>
  );
}