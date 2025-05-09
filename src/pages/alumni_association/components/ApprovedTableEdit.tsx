import VisibilityIcon from '@mui/icons-material/Visibility';
import { 
    Box, 
    IconButton,
    List,
    ListItem,    Stack,
    Typography,
} from '@mui/material';
import { ColumnDef, PaginationState,SortingState } from '@tanstack/react-table';
import { format } from 'date-fns';
import {useCallback, useMemo, useState} from 'react';

import ServerTableAjax from '../../../components/common/table_ajax/ServerTableAjax';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import { ITableData, IViewUpdateHistoryData } from '../interface/ApprovalRequestInterface';
import UpdateHistoryModal from './UpdateHistoryPopUp';
import ViewEvidence from './ViewEvidence';

const listActivity = (lastActivity : string[]) => (
  <List sx={{ listStyleType: 'disc', pl: 2}}>
      {lastActivity.map((item)=>(
          <ListItem sx={{ display: 'list-item', fontSize:'12px' }}>
              {item}
          </ListItem>
      ) )}
  </List>
)

const customActiveText = (active : string) => (
  <Typography sx={{ color:  active ==='Active' ? '#76B743' : '#D12119', fontSize:'12px'}}>{active}</Typography>
)

function StartDutyPeriodColumns (row : ITableData) {
  const {newData, startYear} = row;

  if (newData && newData.length > 0 && newData.includes("Duty Period (Start Date)")){
    return(
        <Typography fontSize='12px' color='#028ED5'>
            {format(startYear,"dd MMMM yyyy")}
        </Typography>
    )
  }
  return(
    <Typography fontSize='12px'>
        {format(startYear,"dd MMMM yyyy")}
    </Typography>
  )
}

function EndDutyPeriodColumns (row : ITableData) {
  const {newData, endYear} = row;

  if (newData && newData.length > 0 && newData.includes("Duty Period (End Date)")){
    return(
        <Typography fontSize='12px' color='#028ED5'>
            {format(endYear,"dd MMMM yyyy")}
        </Typography>
    )
  }
  return(
    <Typography fontSize='12px'>
        {format(endYear,"dd MMMM yyyy")}
    </Typography>
  )
}

export default function ApprovedTableEdit({ 
  searchValue,
  set, 
  reset, 
  pagination, 
  setPagination, 
  dataWatcher,
  startDate,
  endDate,
} : { 
  searchValue: string , 
  set : boolean,
  reset : (data) => void,
  pagination,
  setPagination : (data) => void,
  dataWatcher : boolean,
  startDate : string,
  endDate : string,
}) {
  const [data,setData] = useState<ITableData[]>([]);
  const [totalData, setTotalData] = useState<number>(0);

  const [updateHistoryData, setUpdateHistoryData] = useState<IViewUpdateHistoryData[]>([]);
  const [rowViewed, setRowViewed] = useState<ITableData | null>(null);

  const [openEvidence, setOpenEvidence] = useState(false);
  const [openUpdateHistory, setOpenUpdateHistory] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [confirmationLetterUrl, setConfirmationLetterUrl] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [, setPartialLoading] = useState(false);

  const alumniDetail = (row : ITableData) => (
    <Stack alignItems='center'>
        <IconButton onClick={() => handleClickOpenEvidence(row)}>
            <VisibilityIcon sx={{ color: 'white', backgroundColor: 'orange', borderRadius: '15px', padding: '4px' }} />
        </IconButton>
    </Stack>
  )
  
  const updateHistory = (row : ITableData) => (
    <Stack alignItems='center'>
        <IconButton onClick={() => handleClickOpenUpdateHistory(row)}>
            <VisibilityIcon sx={{ color: 'white', backgroundColor: 'orange', borderRadius: '15px', padding: '4px' }} />
        </IconButton>
    </Stack>
  )

  const column = useMemo<ColumnDef<ITableData>[]> (
    () => [
        {
          accessorKey: 'nim',
          header: 'NIM',
        },
        {
          accessorKey: 'name',
          header: 'Name',
        },
        {
          accessorKey: 'campus',
          header: 'Campus',
        },
        {
          accessorKey: 'faculty',
          header: 'Faculty',
        },
        {
          accessorKey: 'program',
          header: 'Alumni Program',
        },
        {
          accessorKey: 'leaderProgram',
          header: 'Leader of Program',
        },
        {
          accessorKey: 'startYear',
          header: 'Duty Period (Start Date)',
          cell: info => StartDutyPeriodColumns(info.row.original),
        },
        {
          accessorKey: 'endYear',
          header: 'Duty Period (End Date)',
          cell: info => EndDutyPeriodColumns(info.row.original),
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'lastActivity',
          header: 'Last Activity',
          size: 400,
          enableSorting: false,
          cell: info => listActivity(info.row.original.lastActivity),
        },
        {
          accessorKey: 'requestedDate',
          header: 'Requested Date',
          cell: info => format(info.getValue() as string,"dd MMMM yyyy, HH:mm")
        },
        {
          accessorKey: 'leaderStatus',
          header: 'Leader Status',
          cell: info => customActiveText(info.row.original.leaderStatus),
        },
        {
          accessorKey: 'reasonNotActive',
          header: 'Reason (InActive)',
        },
        {
          accessorKey: 'reason',
          header: 'Reason',
        },
        {
          accessorKey: 'status',
          header: 'Status',
        },
        {
          accessorKey : 'sendBackReason',
          header: 'Send Back Reason'
        },
        {
          header: 'Evidence',
          size: 1,
          enableSorting: false,
          cell: info => alumniDetail(info.row.original),
      },
      {
        header: 'Update History',
        size: 1,
        enableSorting: false,
        cell: info => updateHistory(info.row.original),
      },
    ],[data, pagination]
  )

  const getData = useCallback(  
    async (query: string, sort?: SortingState, page?: PaginationState) => {
        const url = `${ApiService.alumniAssociation}/get-approved-alumni-association?type=edit&${query}&startDate=${startDate}&endDate=${endDate}`;
        const response = await apiClient.get(url).then(e => e.data);
        setData(response.listAlumniAssociationData)
        setTotalData(response.totalData)
        if(page){
          setPagination(page);
        }
        if(sort){
          setSorting(sort);
        }
        setTimeout(() => setPartialLoading(false), 1000);
    },[dataWatcher]
  );

  const serverTable = ServerTableAjax<ITableData>({
    data, 
    columns: column, 
    rowCount: totalData,
    page: pagination,
    sort: sorting,
    isMultiSort: false,
    onTableChange: getData,
    pageReset: set,
    search: searchValue
  });

  const getFileUrl = async (mappingLeaderId : number) => {
    apiClient.get(`${ApiService.alumniAssociation}/get-file-url?mappingLeaderId=${mappingLeaderId}`)
      .then(resp => {
          setImageUrl(resp.data.imageUrl)
          setConfirmationLetterUrl(resp.data.confirmationLetterUrl)
          setOpenEvidence(true);
    })
  }

  const handleClickOpenEvidence = (row: ITableData) => {
    setRowViewed(row);
    getFileUrl(row.id)
  };

  const handleClickOpenUpdateHistory = async (row: ITableData) => {
    setRowViewed(row);
    const response = await apiClient.get(`${ApiService.alumniAssociation}/updated-data-history?mappingLeaderId=${row.id}`)
    setUpdateHistoryData(response.data.listGetUpdateHistoryResponseDTO)
    setOpenUpdateHistory(true);
  };

  return (
    <Stack>
        <Box sx={{ width: '100%' }}>
            {serverTable}

            <ViewEvidence
            openEvidence={openEvidence}
            handleClose={() => setOpenEvidence(false)}
            confirmationLetterUrl={confirmationLetterUrl}
            imageUrl={imageUrl}
            rowViewed={rowViewed}
            />

            <UpdateHistoryModal
              updateHistoryData={updateHistoryData}
              openUpdateHistory={openUpdateHistory}
              handleClose={() => setOpenUpdateHistory(false)}
            />
        </Box>
    </Stack>
  );
}