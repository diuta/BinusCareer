import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { 
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography} from '@mui/material';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { format, formatDate, parse } from 'date-fns';
import qs from 'qs';
import { useCallback,useEffect, useMemo, useState } from 'react';
import { RiFolderReceivedFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import * as XLSX from 'xlsx';

import Datepicker from "../../../components/common/Datepicker";
import ServerTableAjax from '../../../components/common/table_ajax/ServerTableAjax'; 
import PageWrapper from '../../../components/container/PageWrapper';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import { selectProfile } from '../../../store/profile/selector';
import { layoutPrivateStyle } from '../../../styles/layout/private-routes';
import { ExportApprovalDataType } from '../Interface/IApprovalEndowment';
import { EndowmentCategory } from '../Interface/IEndowmentMaster';
import { ViewApprovalDataType } from '../Interface/IViewEndowment';
import CustomLoadingButton from '../../../components/common/CustomLoadingButton';

function TabPanel(props: {children?: React.ReactNode; index: number; value: number}){
  const {children, value, index, ...other} = props;

  return(
      <div
          role="tabpanel"
          hidden={value!== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
          {value === index && (
              <Box>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
}

const formatHistoryDate = (dateString: string) => {
  const [datePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  return `${day.toString().padStart(2, '0')} ${monthName} ${year}`;
};

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

interface TableCellValueProps {
  getValue: any;
  row: any;
  column: any;
  table: any;
  tabValue: number;
  updatedData: any[];
}

function TableCellValue({ getValue, row, column, tabValue, table, updatedData }: TableCellValueProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const fieldNameMapping: Record<string, string> = {
    unitName: 'unitId',
    endowmentCategoryName: 'endowmentCategoryId',
  };

  const mappedFieldName = fieldNameMapping[column.id] || column.id;

  const isEdited = checkIfEdited(updatedData, row.original.endowmentId, mappedFieldName);
  const displayValue = getDisplayValue(column.id, value);

  return (
    <Typography variant='label' sx={{ color: isEdited && tabValue === 1 ? '#41abe1' : 'black' }}>
      {displayValue}
    </Typography>
  );
}

function checkIfEdited(updatedData, endowmentId, fieldName) {
  return updatedData.some(
    (update) =>
      update.endowmentId === endowmentId &&
      update.inputName.toLowerCase() === fieldName.toLowerCase()
  );
}

function getDisplayValue(columnId, value) {
  switch (columnId) {
    case 'date':
    case 'period':
      return formatDate(value, 'dd LLLL yyyy');
    case 'dateIn':
      return formatDate(value, 'dd LLLL yyyy, HH:mm');
    case 'debit':
    case 'kredit':
      return formatNumber(value);
    default:
      return value;
  }
}


function HistoryCell({row}){
  const [diff, setDiff] = useState([{
    fieldName: '',
    previousData: '',
    updatedData: '',
    updatedDate: '',
    userUpdate: ''
  }]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<any[]>([]);
  const [category, setCategory] = useState<EndowmentCategory[]>([]);
  const [masterData, setMasterData] = useState<any[]>([]);

  const id = row.original.endowmentId;

  const compareJson = () => {
    apiClient.get(`${ApiService.endowment}/updatedData?id=${id}`)
    .then(resp=>resp)
    .then(resp=>setUpdatedData(resp.data));

    apiClient.get(`${ApiService.endowmentCategory}`)
    .then(resp=>resp)
    .then(resp=>setCategory(resp.data));

    apiClient.get(`${ApiService.endowment}/mappingcampus`)
    .then(resp=>resp)
    .then(resp=>setMasterData(resp.data));
  };


  useEffect(() => {
    if (updatedData.length > 0 && masterData.length > 0) {
      const mappedData = updatedData.map((item) => {
        let previousName = item.previousData;
        let updatedName = item.updatedData;

        if(item.inputName.toLowerCase() === "unitid"){
          previousName = masterData.find((master) => master.mappingCampusProgramId === item.previousData)?.programName || previousName;
          updatedName = masterData.find((master) => master.mappingCampusProgramId === item.updatedData)?.programName || updatedName;
        }
        else if (item.inputName.toLowerCase() === 'endowmentcategoryid') {
          previousName = category.find((master) => master.endowmentCategoryId === Number(item.previousData))?.endowmentCategoryName || previousName;
          updatedName = category.find((master) => master.endowmentCategoryId === Number(item.updatedData))?.endowmentCategoryName || updatedName;
        } 


        return{
          fieldName: item.fieldName,
          previousData: item.fieldName === 'Period' || item.fieldName === 'Date'? formatHistoryDate(previousName) : previousName,
          updatedData: item.fieldName === 'Period' || item.fieldName === 'Date'? formatHistoryDate(updatedName) : updatedName,
          updatedDate: formatDate(item.dateUpdated, 'dd LLLL yyyy, HH:mm'),
          userUpdate: item.userUpdate,
        };
      });
      setDiff(mappedData);
      setIsPopupOpen(true);
    }
  }, [updatedData, masterData, category]);

  return (
    <Stack direction="row">
      <Button onClick={compareJson} name="edit">
        <VisibilityIcon color="primary" />
      </Button>
      <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)} maxWidth='lg'>
        <Stack direction='row' sx={{width:'100%', alignItems:'center'}}>
          <DialogTitle fontWeight='bold'>
            <Typography sx={{fontSize:'16px', fontWeight:700}}>
              View Update History
            </Typography>
          </DialogTitle>
          <Box sx={{flexGrow: 1}}/>
          <Button onClick={() => setIsPopupOpen(false)}>
            <CloseIcon color='primary'/>
          </Button>
        </Stack>
        <Divider sx={{marginBottom:'20px'}}/>
        <DialogContent sx={{paddingBottom:'50px'}}>
          <Table sx={{borderLeft: 1, borderTop: 1, borderColor: 'lightgray'}}>
            <TableHead>
              <TableRow>
                <TableCell sx={{borderRight: 1, borderColor: 'lightgray', fontWeight:'bold'}}><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Field</Typography></TableCell>
                <TableCell sx={{borderRight: 1, borderColor: 'lightgray', fontWeight:'bold'}}><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Previous Data</Typography></TableCell>
                <TableCell sx={{borderRight: 1, borderColor: 'lightgray', fontWeight:'bold'}}><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Updated Data</Typography></TableCell>
                <TableCell sx={{borderRight: 1, borderColor: 'lightgray', fontWeight:'bold'}}><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Updated Date</Typography></TableCell>
                <TableCell sx={{borderRight: 1, borderColor: 'lightgray', fontWeight:'bold'}}><Typography sx={{fontSize:'12px', fontWeight:'bold'}}>Updated By</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diff.length > 0 ? (
                diff.map((data, index) => (
                  <TableRow key={data.fieldName}>
                    <TableCell sx={{borderRight: 1, borderColor: 'lightgray'}}><Typography sx={{fontSize:'12px'}}>{data.fieldName || "-"}</Typography></TableCell>
                    <TableCell sx={{borderRight: 1, borderColor: 'lightgray'}}><Typography sx={{fontSize:'12px'}}>{data.previousData || "-"}</Typography></TableCell>
                    <TableCell sx={{borderRight: 1, borderColor: 'lightgray'}}><Typography sx={{fontSize:'12px'}}>{data.updatedData || "-"}</Typography></TableCell>
                    <TableCell sx={{borderRight: 1, borderColor: 'lightgray'}}><Typography sx={{fontSize:'12px'}}>{data.updatedDate || "-"}</Typography></TableCell>
                    <TableCell sx={{borderRight: 1, borderColor: 'lightgray'}}><Typography sx={{fontSize:'12px'}}>{data.userUpdate || "-"}</Typography></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{borderRight: 1, borderColor: 'lightgray'}}>
                    <Typography sx={{fontSize:'12px'}}>No data available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export function ApprovalEndowmentHistoryTable() {
  const userProfile = useSelector(selectProfile);
  const { currentRoleDetailId, rolePermissions } = userProfile;

  const [tempStartDate, setTempStartDate] = useState<any>('');
  const [tempEndDate, setTempEndDate] = useState<any>('');

  const [updatedData, setUpdatedData] = useState<any[]>([]);
  const [exportData, setExportData] = useState<ExportApprovalDataType[]>([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [approvalData, setApprovalData] = useState<ViewApprovalDataType[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [, setPartialLoading] = useState(false);
  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [set, reset] = useState(false);
  const [pagination, setPagination] = useState({
		pageIndex: 0, 
		pageSize: 10, 
	});

  const renderCellValue = (props: any, updates: any[], tab: any) => (
    <TableCellValue {...props} updatedData={updates} tabValue={tab} />
  )

  type ColumnType = ColumnDef<ViewApprovalDataType>;

  const getColumns = (): ColumnType[] =>{
    const columns: ColumnType[] = [
      {
        accessorKey: 'period',
        header: 'Period',
        cell: props => tabValue !== 1 ? formatDate(props.getValue() as string, 'dd LLLL yyyy') : renderCellValue(props, updatedData, tabValue),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: props => tabValue !== 1 ? formatDate(props.getValue() as string, 'dd LLLL yyyy') : renderCellValue(props, updatedData, tabValue),
      },
      {
        accessorKey: 'alumniNIM',
        header: 'NIM',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'alumniName',
        header: 'Name',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'programName',
        header: 'Program',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'unitName',
        header: 'Unit Name',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'endowmentCategoryName',
        header: 'Category',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'activity',
        header: 'Activity',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell : props => tabValue !== 1 ? props.getValue() : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'debit',
        header: 'Debit',
        cell: (props) => {
          const rowData = props.row.original;
          if (tabValue !== 1) {
            return formatNumber(rowData.debit);
          } 
          return renderCellValue(props, updatedData, tabValue);
        }
      },
      {
        accessorKey: 'kredit',
        header: 'Kredit',
        cell: (props) => {
          const rowData = props.row.original;
      
          if (tabValue !== 1) {
            return formatNumber(rowData.kredit);
          } 
          return renderCellValue(props, updatedData, tabValue);
        }
      },
      {
        accessorKey: 'dateIn',
        header: 'Requested Date',
        cell : props => tabValue !== 1 ? formatDate(props.getValue() as string, 'dd LLLL yyyy, HH:mm') : renderCellValue(props, updatedData, tabValue)
      },
      {
        accessorKey: 'userIn',
        header: 'Requested By',
      },
      ...(tabValue === 1 || tabValue === 2 ? [
        {
          accessorKey: 'reason',
          header: 'Reason',
        } as ColumnDef<ViewApprovalDataType>
      ] : []),
      {
        accessorKey: 'approvalStatusName',
        header: 'Status',
      },
      {
        accessorKey: 'sendBackReason',
        header: 'Send Back Reason',
        cell: props => props.getValue() ?? "-"
      },
      ...(tabValue === 1 ? [
        {
          accessorKey: 'Actions',
          header: 'Update History',
          cell: HistoryCell,
        }
      ] : []),
    ];
    return columns;
  };

  const columns = useMemo(() => getColumns(), [tabValue]);

  const getViewApproval = useCallback(
    async (query: string, sort?: SortingState, page?: PaginationState) => {

      const param = {
        TabValue: tabValue,
        startPeriod: tempStartDate,
        endPeriod: tempEndDate,
        history: true,
      };
      const url = `${ApiService.endowment}/viewApprovalEndowment?${query}&${qs.stringify(param)}`
      const response = await apiClient.get(url).then(e => e.data);
      setApprovalData(response.data);
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

  const getExportApproval = useCallback(
    async () => {
      setLoadingExport(true);
      apiClient.get(`${ApiService.endowment}/export-approval?userRoleDetail=${currentRoleDetailId}&startPeriod=${tempStartDate ?? ''}&endPeriod=${tempEndDate ?? ''}`)
      .then(resp=>resp)
      .then(resp=>{
        setExportData(resp.data);
        setLoadingExport(false);
      })
      .catch(_error => {
        setLoadingExport(false);
      });
    }, [tempStartDate, tempEndDate]
  );

  const callUpdatedData = useCallback(
    async() => {
      apiClient.get(`${ApiService.endowment}/updatedData`)
      .then(resp => resp)
      .then(resp => setUpdatedData(resp.data));
    }, []
  );
  
  useEffect(() => {
    getExportApproval();
  }, []);

  useEffect(() => {
    callUpdatedData()
  }, []);

  const handleApplySearch = () => {
    getExportApproval();
  };

  const HandleExportToExcel = () => {
    setLoadingExport(true);
    const headers = ['Period', 'Date', 'NIM', 'Name', 'Campus', 'Faculty', 'Program', 'Degree', 'Unit Name', 'Category',  'Debit', 'Kredit', 'Activity', 'Description', 'Status', 'Action Type', 'Reason', 'Send Back Reason', 'Requested Date', 'Requested By'];
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
      item.debit,
      item.kredit,
      item.activity,
      item.description,
      item.status,
      item.actionType,
      item.reason,
      item.sendBackReason,
      format(item.requestedDate, 'yyyy-MM-dd HH:mm'),
      item.requestedBy
    ]);
    const data = [headers, ...rows];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'endowmentData.xlsx');
    setLoadingExport(false);
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setDataWatcher(!dataWatcher);
    reset(!set);
  };  

  const serverTable = ServerTableAjax<ViewApprovalDataType>({
    data: approvalData, 
    columns, 
		rowCount: totalResults,
		page: pagination,
		sort: sorting,
		isMultiSort: false,
		onTableChange: getViewApproval,
		pageReset: set,
		search
	});

  const handleSearch =  useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearch(searchTerm);
		reset(!set);
  }, 1000);

  return (
    <PageWrapper>
      <Stack direction='row' width='50%' gap='10px'>
        <Stack width='50%'>
          <Typography sx={{fontSize:'12px', fontWeight:400}}>Start Period</Typography>
        </Stack>
        <Typography alignContent='center'>&nbsp;&nbsp;</Typography>
        <Stack width='50%'>
          <Typography sx={{fontSize:'12px', fontWeight:400}}>End Period</Typography>
        </Stack>
      </Stack>
      <Stack direction='row' width='75%' gap='10px'>
        <Stack width='75%'>
          <Datepicker
            value={tempStartDate}
            onChange={(date) => setTempStartDate(date)}
            id="entryYear"
            dateFormat="dd-MM-yyyy"
            clearIcon
            autoClose
          />
        </Stack>
        <Typography alignContent='center' sx={{fontSize:'24px', fontWeight:400}}>-</Typography>
        <Stack width='75%'>
          <Datepicker
            value={tempEndDate}
            onChange={(date) => setTempEndDate(date)}
            id="endYear"
            dateFormat="dd-MM-yyyy"
            clearIcon
            autoClose
          />
        </Stack>
        <Stack width='75%'>
          <Button
            variant="contained"
            color="primary"
            sx={{...layoutPrivateStyle.modalChangeButton, width:'100px',height:'94%'}}
            size='medium'
            onClick={() =>{
              handleApplySearch();
              setDataWatcher(!dataWatcher);
            }}
          >
            <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>Search</Typography>
          </Button>
        </Stack>  
      </Stack>
      <Divider sx={{marginY: "20px"}}/>
      <Stack direction='row' gap='10px' sx={{width: '100%'}}>
        {rolePermissions.some(item => item.permissionName === 'export-approval-endowment') && (
          <CustomLoadingButton
              loading={loadingExport}
              variant="contained"
              color="success"
              sx={{...layoutPrivateStyle.modalChangeButton, width:'100px', marginBottom:'20px'}}
              size='medium'
              startIcon={<RiFolderReceivedFill style={{transform:'scaleX(-1)'}}/>}
              onClick={HandleExportToExcel}
            >
              <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>EXPORT</Typography>
            </CustomLoadingButton>
        )}
        <Box sx={{flexGrow: 1}}/>
          <Typography sx={{marginY: '8px', fontSize:'14px', fontWeight:'400'}}>Search: </Typography>
          <TextField 
            variant="outlined" 
            onChange={(e) => handleSearch(e)}
          />
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              borderBottom: 3,
              borderColor: 'primary.main',
              marginBottom: '-20px',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant='standard'
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                '& button':{
                    marginRight:'1px',
                    borderTopLeftRadius:'5px',
                    borderTopRightRadius:'5px',
                },
                '& .MuiTab-root': {
                  backgroundColor: 'lightgray',
                  color: 'black',
                },
                '& .Mui-selected': {
                  color: 'white !important', 
                  backgroundColor: 'primary.main', 
                },
                '& .MuiTabs-indicator': {
                  display: 'none', 
                },
              }}
            >
              <Tab
                  label={
                    <Typography sx={{fontSize:'12px', fontWeight:400}}>
                      Add Data
                    </Typography>
                  }
                  sx={{
                      backgroundColor: tabValue !== 0 ? 'lightgray' : 'primary.main',
                  }}
              />
              <Tab
                  label={
                    <Typography sx={{fontSize:'12px', fontWeight:400}}>
                      Edit Data
                    </Typography>
                  }
                  sx={{
                      backgroundColor: tabValue !== 1 ? 'lightgray' : 'primary.main',
                  }}
              />
              <Tab
                  label={
                    <Typography sx={{fontSize:'12px', fontWeight:400}}>
                      Delete Data
                    </Typography>
                  }
                  sx={{
                      backgroundColor: tabValue !== 2 ? 'lightgray' : 'primary.main',
                  }}
              />
          </Tabs>
          </Box>
              <TabPanel value={tabValue} index={0}>
                <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2, marginTop:'20px'}}>
                  <Box sx={{ position: 'relative' }}>
                    {serverTable}
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2, marginTop:'20px'}}>
                  <Box sx={{ position: 'relative' }}>
                    {serverTable}
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCC', borderRadius: "6px", mb: 2, marginTop:'20px'}}>
                  <Box sx={{ position: 'relative' }}>
                    {serverTable}
                  </Box>
                </Stack>
              </TabPanel>
        </Box> 
    </PageWrapper>
  );
}


ApprovalEndowmentHistoryTable.propTypes = null;
HistoryCell.propTypes = null;