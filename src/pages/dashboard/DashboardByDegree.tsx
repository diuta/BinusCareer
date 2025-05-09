/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datepicker/dist/react-datepicker.css';

import {
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	FormControlLabel,
	FormGroup,
	Stack,
	TextField,
	Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	ColumnDef,
	PaginationState,
	SortingState,
} from '@tanstack/react-table';
import { FormikErrors, useFormik } from 'formik';
import qs from 'qs';
import { useCallback,useEffect, useMemo,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import CustomLoadingButton from '../../components/common/CustomLoadingButton';
import { ModalAlert } from '../../components/common/modal-alert'
import MultiSelect from '../../components/common/multiselect/MultiSelect';
import RangeYearpicker from '../../components/common/RangeYearpicker';
import ServerTableAjax from '../../components/common/table_ajax/ServerTableAjax';
import PageWrapper from '../../components/container/PageWrapper';
import apiClient from '../../config/api-client';
import { ApiService } from '../../constants/ApiService';
import { Option } from "../../interfaces/ITypes";
import { selectProfile } from "../../store/profile/selector";
import PieChartComp from './component/PieChart';
import { ChartData, DataRequests, ExportModal,ListDetailDashboard, SearchFilters } from './interface/DetailInterface';

type ColumnType = ColumnDef<ListDetailDashboard>;

const getColumns = (): ColumnType[] => {
	const columns: ColumnType[] = [
	{
		accessorKey: 'alumniNIM',
		header: 'NIM',
	},
	{
		accessorKey: 'alumniName',
		header: 'Name',
	},
	{
		accessorKey: 'campusName',
		header: 'Campus',
	},
	{
		accessorKey: 'facultyName',
		header: 'Faculty',
	},
	{
		accessorKey: 'programName',
		header: 'Program',
	},
	{
		accessorKey: 'degreeName',
		header: 'Degree',
	},
	{
		accessorKey: 'entryYear',
		header: 'Entry Year',
	},
	{
		accessorKey: 'graduationYear',
		header: 'Graduation Year',
	},
];
	return columns;
};
const CAMPUS = 'campusId';
const FACULTY = 'facultyId';
const PROGRAM = 'programId';
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
export function DetailDashboardByDegree(){
	const navigate = useNavigate();
	const [modal, setModal] = useState<ExportModal>({
		variant: 'failed',
		title: 'Oh No!',
		message: 'Something went wrong. Please try again later.',
		button: 'OK',
		open: false
	});
	const [loading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const [exportLoading, setExportLoading] = useState(false);
	const handleClose = () => setModal({...modal, open: false});
	const userProfile = useSelector(selectProfile);

	const [data, setData] = useState<ListDetailDashboard[]>([]);
	const [search, setSearch] = useState<string>('');
	const [dataWatcher, setDataWatcher] = useState<boolean>(false);
	const [campusList, setCampusList] = useState<Option[]>([]);
	const [facultyList, setFacultyList] = useState<Option[]>([]);
	const [filterWatcher, setFilterWatcher] = useState<string>('');
	const [filterOrder, setFilterOrder] = useState<string[]>(['campus', 'faculty', 'program']);
	const [programList, setProgramList] = useState<Option[]>([]);
	const [degreeList, setDegreeList] = useState<Option[]>([]);
	const [rowCount,setRowCount] = useState<number>(0);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [degreeChart, setDegreeChart] = useState<ChartData>({
		loaded: false,
		data: [],
		radius: {
			inner: "50",
			outer: "120"
		}
	});
	const [set, reset] = useState(false);
	const reason = useRef<HTMLInputElement>(null);

	// MARK: Formik
	// #region Formik
	const initialValues: SearchFilters & DataRequests = {
		filter: {
			campusId: [],
			facultyId: [],
			programId: [],
			degreeId: [],
			sectorId: [],
			companyCategoryId: [],
			jobCategoryId: [],
			positionLevelId: [],
			entryYear: [],
			graduationYear: [],
		},
		request: {
			phone: false,
			email: false,
			dob: false,
			pob: false,
			gpa: false
		},
		reason: ""
	}
	const validate = (values: SearchFilters & DataRequests) => {
		const errors: FormikErrors<SearchFilters & DataRequests> = {};

		if (!values.reason) {
			errors.reason = "Reason is required";
		}

		return errors;
	};
	const formik = useFormik<SearchFilters & DataRequests >({
		initialValues,
		enableReinitialize: true,
		onSubmit: (values) => {
			// CURRENTLY  UNUSED
		},
		validate
	});
	const debounce = useDebouncedCallback(
    (field, value) => {
      formik.setFieldValue(field, value);
    },
    1000
  );
	// #endregion
	// MARK: Excel
	// #region Export Data
	const createExcel = useCallback(async () => {
		await formik.setTouched({reason: true}, true);
		const hasError = await formik.validateForm().then(e => Object.prototype.hasOwnProperty.call(e, 'reason'));
		if(hasError) return;

		setExportLoading(true);
		const hasConfidential = Object.entries(formik.values.request).some(([, v]) => v);

		const exportParam = (obj: object, predicate: (v: Array< string> | string) => boolean | string) =>
			Object.keys(obj)
						.filter( key => predicate(obj[key]) )
						.reduce((res, key) => {
							res[key] = obj[key];
							return res;
						}, {});

		const param = {
			hasConfidential,
			reason: formik.values.reason,
			excludedFields: ["CompanyName", "CompanyCategoryName", "PositionName", "PositionLevelName", "CountryName", "ProvinceName", "CityName", "SectorName", "JobCategoryName"],
			filters: exportParam(formik.values.filter, (v) => Array.isArray(v) ? v.length > 0 : v),
		}
		const request = hasConfidential ? Object.assign(param, {...formik.values.request}) : param;
		const response = await apiClient.post(ApiService.dashboardExport, request);
		setTimeout(() => setExportLoading(false), 1000);
		if(response.status !== 200){
			setModal({
				variant: 'failed',
				title: 'Oh No!',
				message: 'Something went wrong. Please try again later.',
				button: 'OK',
				open: true
			})
		}

		setModal({
			variant: 'success',
			title: 'Success',
			message: 'Your Data Request is Submitted Successfully. You will be notified when it is ready.',
			button: 'OK',
			open: true
		});

		if(reason.current){
			reason.current.value = '';
		}
		formik.resetForm();
		reset(!set);
		setDataWatcher(!dataWatcher);
	}, [data, formik.values.request, formik.values.reason]);
	// #endregion

	// MARK: API Getter/Setter
	// #region API
	const filterInvalidValue = (value: string[], list: Option[]) => value.filter((item) => list.map(dt => dt.value).includes(item));
	const getDashboardByJob = useCallback(async (query: string, sort?: SortingState, page?: PaginationState) => {
		setTableLoading(true);
		const param = {
			CampusId: formik.values.filter.campusId,
			FacultyId: formik.values.filter.facultyId,
			ProgramId: formik.values.filter.programId,
			DegreeId: formik.values.filter.degreeId,
			EntryYear: formik.values.filter.entryYear == null ? [] : formik.values.filter.entryYear,
			GraduationYear: formik.values.filter.graduationYear == null ? [] : formik.values.filter.graduationYear,
		}
		const url = `${ApiService.dashboardTable}?${query}&${qs.stringify(param)}`;
		const response = await apiClient.get(url).then(e => e.data);
		const modifiedData = response.data.map((item: ListDetailDashboard) => ({
			...item,
			entryYear: item.entryYear ? new Date(item.entryYear).getFullYear().toString() : "-",
			graduationYear: item.graduationYear ? new Date(item.graduationYear).getFullYear().toString() : "-",
		}));

		setData(modifiedData);
		setRowCount(response.dataCount);
		if(page)
			setPagination(page);
		if(sort)
			setSorting(sort);
		setTimeout(() => setTableLoading(false), 1000);
		// setTableLoading(false);
	}, [dataWatcher]);
  const getCampusesByRole = useCallback(
    async (filterParams?: { faculty: boolean; program: boolean }) => {
      const params = {
        facultyId: filterParams?.faculty ? formik.values.filter.facultyId : [],
        programId: filterParams?.program ? formik.values.filter.programId : [],
        useCurrentRole: true,
      };
      const response = await apiClient.get(ApiService.campus, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });
      const mappedResponse = response.data.listDropdown;
      setCampusList(mappedResponse);

      const filteredValue = filterInvalidValue(
        formik.values.filter.campusId,
        mappedResponse
      );

      if (filteredValue.length !== formik.values.filter.campusId.length) {
        setFilterWatcher(CAMPUS);
      }
      formik.setFieldValue('campusId', filteredValue);
    },
    [filterWatcher]
  );

  const getFacultiesByRole = useCallback(
    async (filterParams?: { campus: boolean; program: boolean }) => {
      const params = {
        campusId: filterParams?.campus ? formik.values.filter.campusId : [],
        programId: filterParams?.program ? formik.values.filter.programId : [],
        useCurrentRole: true,
      };

      const response = await apiClient.get(ApiService.faculty, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });
      const mappedResponse = response.data.listDropdown;
      setFacultyList(mappedResponse);

      const filteredValue = filterInvalidValue(
        formik.values.filter.facultyId,
        mappedResponse
      );

      formik.setFieldValue('facultyId', filteredValue);
    },
    [filterWatcher]
  );

  const getProgramsByRole = useCallback(
    async (filterParams?: { faculty: boolean; campus: boolean }) => {
      const params = {
        campusId: filterParams?.campus ? formik.values.filter.campusId : [],
        facultyId: filterParams?.faculty ? formik.values.filter.facultyId : [],
        useCurrentRole: true,
      };
      const response = await apiClient.get(ApiService.program, {
        params,
        paramsSerializer: p => qs.stringify(p),
      });

      const mappedResponse = response.data.listDropdown;

      setProgramList(mappedResponse);

      const filteredValue = filterInvalidValue(
        formik.values.filter.programId,
        mappedResponse
      );

      formik.setFieldValue('programId', filteredValue);
    },
    [filterWatcher]
  );
	const getMasterFilters = async() => {
		getCampusesByRole();
		getFacultiesByRole();
		getProgramsByRole();

		const degreesResponse = await apiClient.get(ApiService.degree);
		setDegreeList(degreesResponse.data.listDropdown);
	};
	const getDegreeChart = async (useParam: boolean = false) => {
		const param = {
			CampusId: formik.values.filter.campusId,
			FacultyId: formik.values.filter.facultyId,
			ProgramId: formik.values.filter.programId,
			DegreeId: formik.values.filter.degreeId,
			EntryYear: formik.values.filter.entryYear == null ? [] : formik.values.filter.entryYear,
			GraduationYear: formik.values.filter.graduationYear == null ? [] : formik.values.filter.graduationYear,
		}
		const url = ApiService.dashboardDegree + (useParam ? `?${qs.stringify(param)}` : '');
		const response = await apiClient.get(url);
		setDegreeChart({...degreeChart, data: response.data, loaded: true});
	};

	useEffect(() => {
		getMasterFilters();
		getDegreeChart();
	}, []);
	useEffect(() => {
		getDegreeChart(true);
	}, [dataWatcher]);
  useEffect(() => {
    if (filterWatcher === '') return;

    const newestKeyOrder = handleKeyOrder(
      formik.values.filter[filterWatcher],
      filterWatcher,
      filterOrder
    );

    const [facultyOrder, campusOrder, programOrder] = getKeyIndex(
      newestKeyOrder,
      FACULTY,
      CAMPUS,
      PROGRAM
    );

    const [selectedOrder] = getKeyIndex(
      filterOrder,
      filterWatcher
    );

    if (
      (filterWatcher !== CAMPUS ||
        formik.values[filterWatcher].length === 0) &&
      selectedOrder <= campusOrder
    ) {
      getCampusesByRole({
        program: campusOrder > programOrder,
        faculty: campusOrder > facultyOrder,
      });
    }

    if (
      (filterWatcher !== FACULTY ||
        formik.values[filterWatcher].length === 0) &&
      selectedOrder <= facultyOrder
    ) {
      getFacultiesByRole({
        program: facultyOrder > programOrder,
        campus: facultyOrder > campusOrder,
      });
    }

    if (
      (filterWatcher !== PROGRAM ||
        formik.values[filterWatcher].length === 0) &&
      selectedOrder <= programOrder
    ) {
      getProgramsByRole({
        campus: programOrder > campusOrder,
        faculty: programOrder > facultyOrder,
      });
    }

    setFilterOrder(newestKeyOrder);
    setFilterWatcher('');
  }, [filterWatcher]);
	// #endregion

	// MARK: Table
	// #region Table
	const columns = useMemo(() => getColumns(), []);
	const serverTable = ServerTableAjax<ListDetailDashboard>({
    data,
    columns,
		rowCount,
		page: pagination,
		sort: sorting,
		isMultiSort: false,
		onTableChange: getDashboardByJob,
		pageReset: set,
		search
	});
	const handleSearch =  useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearch(searchTerm);
		reset(!set);
  }, 1000);
	// #endregion
	const renderChart = useCallback(() => {
		if (degreeChart.data.length > 0)
			return (
				<Stack sx={{ width: { xs: '100%', md: '75%', lg: '50%' }, height: '100%' }}>
					<PieChartComp
						data={degreeChart.data}
						legendLayout='vertical'
						grid={1}
					/>
				</Stack>
			);
		return (
			<Stack sx={{ width: { xs: '90%', md: '80%' }, height: '100%' }}>
				<Typography
					variant='h6'
					sx={{
						margin: 'auto',
						color: '#f3931b',
						fontWeight: 'bold',
					}}>
					{ degreeChart.loaded ? 'Chart Unavailable: No Degree Data' : 'Loading Data...' }
				</Typography>
			</Stack>
		)
	}, [degreeChart]);

	return (
		<PageWrapper>
			{loading ? <CircularProgress /> :
				<Stack sx={{mx:'auto', width: '100%'}}>
					<ModalAlert
						variant={modal.variant}
						open={modal.open}
						title={modal.title}
						message={modal.message}
						buttonTitle={modal.button}
						onClose={handleClose}
						onOk={handleClose}
					/>
					<Stack
            width="100%"
						marginX="auto"
            height="384px"
            alignItems="center"
            justifyContent="space-around"
            marginBottom="15px"
          >
              {renderChart()}
					</Stack>
					<Grid container spacing={2} width='100%' sx={{mx: 'auto', pt: 2}}>
						{/* <Grid container spacing={2} width='100%' sx={{mx: 'auto', mb: 2}}> */}
							<Grid size={{ xs: 12 }}>
								<Typography variant="label"  >Campus</Typography>
								<Stack width="100%">
									<MultiSelect
										data={campusList}
										value={formik.values.filter.campusId}
										onChange={(value) => {
											formik.setFieldValue('filter.campusId', value);
											setFilterWatcher(CAMPUS);
										}}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
								<Typography variant="label"  >Faculty</Typography>
								<Stack width="100%">
									<MultiSelect
										data={facultyList}
										value={formik.values.filter.facultyId}
										onChange={(value) => {
											formik.setFieldValue('filter.facultyId', value);
											setFilterWatcher(FACULTY);
										}}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
								<Typography variant="label"  >Program</Typography>
								<Stack width="100%">
									<MultiSelect
										data={programList}
										value={formik.values.filter.programId}
										onChange={(value) => {
											formik.setFieldValue('filter.programId', value);
											setFilterWatcher(PROGRAM);
										}}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
								<Typography variant="label"  >Degree</Typography>
								<Stack width="100%">
									<MultiSelect
										data={degreeList}
										value={formik.values.filter.degreeId}
										onChange={(value) => formik.setFieldValue('filter.degreeId', value)}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, lg: 6 }} >
								<Typography variant="label"  >Entry Year</Typography>
								<Stack width='99.6%'>
									<RangeYearpicker
										value={formik.values.filter.entryYear}
										onChange={date => formik.setFieldValue('filter.entryYear', date)}
										id="entryYear"
										clearIcon
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, lg: 6 }}>
								<Typography variant="label"  >Graduation Year</Typography>
								<Stack width='99.6%'>
									<RangeYearpicker
										value={formik.values.filter.graduationYear}
										onChange={date => formik.setFieldValue('filter.graduationYear', date)}
										id="graduationYear"
										clearIcon
									/>
								</Stack>
							</Grid>
						{/* </Grid> */}
						<Grid size={{ xs: 12 }}>
							<Button variant='contained' sx={{display: 'flex', gap: '10px', ml: 'auto', mt: 2}} onClick={() => {
									reset(!set);
									setDataWatcher(!dataWatcher);
							}}>
								Apply
							</Button>
						</Grid>
					</Grid>
					<Divider sx={{my: 4}} />
					<Stack direction='row' gap='20px' justifyContent='end' width='100%' sx={{mb: 2}}>
						<Typography sx={{marginY: 'auto'}}>Search: </Typography>
							<TextField
							variant="outlined"
							placeholder='Search By'
							onChange={e => handleSearch(e)}
							/>
					</Stack>
					<Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2}}>
						{serverTable}
					</Stack>
					{userProfile?.rolePermissions?.some(permission =>
						permission.permissionName === "export-alumni-data"
					) && (
						<Stack>
							<Stack direction='column' gap='20px' width='100%' sx={{overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", px: 4, py: 2, mb: 2}}>
								<Typography variant='h6' sx={{mt: 2}}>Request Confidential Data</Typography>
								<FormGroup row sx={{justifyContent: 'space-between', width: '100%', mb: 2}}>
								<FormControlLabel
										sx={{ width: { xs: '40%', sm: '15%' } }}
										control={<Checkbox checked={formik.values.request.phone} />}
										label={<Typography sx={{ fontSize: 12, margin: 'auto auto auto 0' }}>Phone</Typography>}
										name="request.phone"
										onChange={formik.handleChange}
									/>
									<FormControlLabel
										sx={{ width: { xs: '40%', sm: '15%' } }}
										control={<Checkbox checked={formik.values.request.email} />}
										label={<Typography sx={{ fontSize: 12, margin: 'auto auto auto 0' }}>Email</Typography>}
										name="request.email"
										onChange={formik.handleChange}
									/>
									<FormControlLabel
										sx={{ width: { xs: '40%', sm: '15%' } }}
										control={<Checkbox checked={formik.values.request.dob} />}
										label={<Typography sx={{ fontSize: 12, margin: 'auto auto auto 0' }}>Date of Birth</Typography>}
										name="request.dob"
										onChange={formik.handleChange}
									/>
									<FormControlLabel
										sx={{ width: { xs: '40%', sm: '15%' } }}
										control={<Checkbox checked={formik.values.request.pob} />}
										label={<Typography sx={{ fontSize: 12, margin: 'auto auto auto 0' }}>Place of Birth</Typography>}
										name="request.pob"
										onChange={formik.handleChange}
									/>
									<FormControlLabel
										sx={{ width: { xs: '40%', sm: '15%' } }}
										control={<Checkbox checked={formik.values.request.gpa} />}
										label={<Typography sx={{ fontSize: 12, margin: 'auto auto auto 0' }}>IPK</Typography>}
										name="request.gpa"
										onChange={formik.handleChange}
									/>
								</FormGroup>
							</Stack>
							<Stack direction='column' gap='20px' width='100%' sx={{overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", px: 4, py: 2, mb: 2}}>
								<Typography variant='h6' sx={{mt: 2}}>Request Reason</Typography>
								<FormGroup row sx={{justifyContent: 'space-between', width: '100%', mb: 2}}>
									<TextField
										name="reason"
										aria-label="minimum height"
										minRows={3}
										placeholder="Data Request Reason"
										onChange={(e) => {
											e.persist();
											const { name, value } = e.target;
											debounce(name, value);
										}}
										variant='outlined'
										fullWidth
										multiline
										required
										inputProps={{ style: { fontSize: 12 } }}
										inputRef={reason}
										/>
										{formik.errors.reason && formik.touched.reason ? (
										<Typography sx={{ color: "red" }} variant="label">
											{formik.errors.reason}
										</Typography>
									) : null}
								</FormGroup>
							</Stack>
							<Stack direction='row' gap="20px" justifyContent='end' width='100%' sx={{mx: 'auto', mb: 2}}>
								<Button variant='contained' color='secondary' sx={{display: 'flex', gap: '10px'}} onClick={() => navigate('/')}>
									Cancel
								</Button>
								<CustomLoadingButton variant='contained' sx={{display: 'flex', gap: '10px'}} loading={exportLoading || tableLoading} onClick={() => createExcel()}>
									Export
								</CustomLoadingButton>
							</Stack>
						</Stack>
					)}
				</Stack>
			}
		</PageWrapper>
	)
}
