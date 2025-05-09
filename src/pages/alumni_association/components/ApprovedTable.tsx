
import { 
    Box,
    Button,
    CircularProgress,
    Stack,
    Tab,
    Tabs,    TextField,
    Typography} from '@mui/material';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BiSolidFileExport } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import * as XLSX from "xlsx";

import CustomLoadingButton from '../../../components/common/CustomLoadingButton';
import Datepicker from '../../../components/common/Datepicker';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import useModal from '../../../hooks/use-modal';
import { selectProfile } from '../../../store/profile/selector';
import { IExportData, IFormValues } from '../interface/ApprovalRequestInterface';
import ApprovedTableAdd from './ApprovedTableAdd';
import ApprovedTableEdit from './ApprovedTableEdit';

function TabPanelApproval(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ backgroundColor: 'white', paddingBottom: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ApprovedTable() {
  const [searchValue,setSearchValue] = useState('');
  const [type,setType] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const userProfile = useSelector(selectProfile)
  const { rolePermissions} = userProfile;
  const [roleName,setRoleName] =useState<string[]>([]);
  const [loadingExport, setLoadingExport] = useState(false)

  const [dataWatcher, setDataWatcher] = useState<boolean>(false);
  const [set, reset] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: 10, 
  }); 

  const {showModal} = useModal();

  const formik = useFormik<IFormValues>({
    initialValues : {
      startDate : null,
      endDate : null
    },
    onSubmit : async (values) => {
      if(values.startDate){
        setStartDate(values.startDate.toString());
      } else {
        setStartDate('');
      }
      if(values.endDate){
        setEndDate(values.endDate.toString());
      } else {
        setEndDate('')
      }
      setDataWatcher(!dataWatcher)
      setPagination({
        pageIndex: 0, 
        pageSize: 10, 
      })
    }
  })

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value.toLowerCase());
  }
  
  const handleExport = async () => {
    setLoadingExport(true);

    
    const response = await apiClient.get(`${ApiService.alumniAssociation}/export-approved-alumni-association?&startDate=${startDate}&endDate=${endDate}`);
    const exportedData : IExportData[] = response.data.listExportApprovedAssociation;
    
    if (exportedData.length > 0) {
      const transformedData = exportedData.map(item => ({
        Faculty: item.faculty,
        "Alumni Program": item.program,
        "Leader of Program": item.leaderProgram,
        Degree: item.degree,
        Nim: item.nim,
        Name : item.name,
        "Entry Year": item.entryYear ? format(item.entryYear,"yyyy") : "-",
        "Graduation Year": item.graduationYear ? format(item.graduationYear,"yyyy"): "-",
        Email : item.email,
        "Phone Number": item.phoneNumber,
        "Duty Period (Start Year)" : format(item.startYear,"yyyy"),
        "Duty Period (End Year)" : format(item.endYear,"yyyy"),
        "Leader Status" : item.leaderStatus,
        "Reason (Not Active)" : item.reasonNotActive,
        Status : item.status,
        "Action Type": item.actionType,
        Reason: item.reason,
        "Send Back Reason": item.sendBackReason,
        "Requested Date": format(item.requestedDate,"yyyy-MM-dd HH:mm"),
      }))

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(transformedData);

      const wrapTextStyle = {
        alignment: {
        wrapText: true,
        },
      };

      for (let R = 1; R <= transformedData.length; R+=1) {
          const cell = ws[XLSX.utils.encode_cell({ r: R, c: 10 })];
          if (cell) {
          cell.s = wrapTextStyle;
          }
      }

      const colWidths = transformedData.reduce((acc: any, row: any) => {
          Object.keys(row).forEach((key, index) => {
          const value = row[key] ? row[key].toString() : "";
          acc[index] = Math.max(acc[index] || 10, value.length + 2);
          });
          return acc;
      }, []);

      ws["!cols"] = colWidths.map((w: number) => ({ wch: w }));
  
      XLSX.utils.book_append_sheet(wb,ws, "MySheet1");
  
      XLSX.writeFile(wb, "ApprovalAlumniAssociation.xlsx");

      showModal({
        title: 'Export Success',
        message: 'Export Data is Successfull',
        options: { 
            variant: 'success' ,
            onOk: () => setLoadingExport(false)
        },
      });
    } else {
      showModal({
        title: 'Failed',
        message: 'There is no Report Data',
        options: { 
            variant: 'failed' ,
            onOk: () => setLoadingExport(false)
        },
      });
    }
  }
  
  useEffect (() => {
    rolePermissions.map((item)=> (
      setRoleName((prevData)=>[...prevData, item.permissionName])
    ));
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack>
          <Typography variant='h5'>History</Typography>

          <Stack direction='row' gap='20px' alignItems='end' margin='15px 0px'>
            <Stack gap='10px'>
              <Typography fontSize='12px'>Start Period</Typography>
              <Datepicker
                  value={formik.values.startDate}
                  onChange={(date) => formik.setFieldValue('startDate', date)}
                  id="startDate"
                  dateFormat='dd-MM-yyyy'
                  autoClose
                  clearIcon
                  />
            </Stack>

            <Stack gap='10px'>
              <Typography fontSize='12px'>End Period</Typography>
              <Datepicker
                  value={formik.values.endDate}
                  onChange={(date) => formik.setFieldValue('endDate', date)}
                  id="endDate"
                  dateFormat='dd-MM-yyyy'
                  autoClose
                  clearIcon
                  />

            </Stack>
            <Button type='submit' sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', fontSize:'13px'}}>
              Search
            </Button>
          </Stack>
          
          {roleName.includes("export-approval-alumni-association") ? (
            <Stack direction='row' alignItems='center' gap='10px' margin='15px 0px' justifyContent='space-between'>
              <CustomLoadingButton
                  loading={loadingExport}
                  startIcon={loadingExport ? <CircularProgress size={20} color="inherit" /> : <BiSolidFileExport />}
                  variant="contained"
                  color="success"
                  sx={{ width:'100px'}}
                  size='medium'
                  onClick={handleExport}
              >
                  <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{loadingExport ? 'Loading...' : 'EXPORT'}</Typography>
              </CustomLoadingButton>
                <Stack direction='row' alignItems='center' gap='10px'>
                  <Typography fontSize='14px'>Search: </Typography>
                  <TextField sx={{ fontSize:'14px' }} variant='outlined' placeholder='Search By' onChange={handleSearch}/>
                </Stack>
            </Stack>
          ) : (
            <Stack direction='row' alignItems='center' gap='10px' margin='15px 0px' justifyContent='end'>
                <Stack direction='row' alignItems='center' gap='10px'>
                  <Typography fontSize='14px'>Search: </Typography>
                  <TextField sx={{ fontSize:'14px' }} variant='outlined' placeholder='Search By' onChange={handleSearch}/>
                </Stack>
            </Stack>
          )}

          <Box sx={{ borderBottom: 3, borderColor: 'primary.main' }}>
            <Tabs
              value={type}
              onChange={(_, value) => setType(value)}
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                '& button': {
                  marginRight: '1px',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
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
                label="add data"
                sx={{
                  backgroundColor:
                    type !== 0 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
              <Tab
                label="edit data"
                sx={{
                  backgroundColor:
                  type !== 1 ? 'lightgray' : 'primary.main',
                  fontSize: '12px',
                }}
              />
            </Tabs>
          </Box>

          <TabPanelApproval value={type} index={0}>
            <ApprovedTableAdd
            searchValue={searchValue} 
            set = {set}
            reset = {reset}
            pagination = {pagination}
            setPagination = {setPagination}
            dataWatcher = {dataWatcher}
            startDate={startDate}
            endDate={endDate}
            />
          </TabPanelApproval>
          <TabPanelApproval value={type} index={1}>
            <ApprovedTableEdit
            searchValue={searchValue} 
            set = {set}
            reset = {reset}
            pagination = {pagination}
            setPagination = {setPagination}
            dataWatcher = {dataWatcher}
            startDate={startDate}
            endDate={endDate}
            />
          </TabPanelApproval>

      </Stack>
    </form>
  );
}