import VisibilityIcon from '@mui/icons-material/Visibility';
import { 
    Box, 
    IconButton,
    List,
    ListItem,    Stack,
    Typography,
} from '@mui/material';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { format } from 'date-fns';
import {useCallback, useMemo, useState} from 'react';

import ServerTableAjax from '../../../components/common/table_ajax/ServerTableAjax';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import { ITableData} from '../interface/ApprovalRequestInterface';
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

export default function ApprovedTableAdd({ 
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
  const [rowViewed, setRowViewed] = useState<ITableData | null>(null);
  const [totalData, setTotalData] = useState<number>(0);

  const [openEvidence, setOpenEvidence] = useState(false);
  const [imageUrl, setImageUrl] = useState("")
  const [confirmationLetterUrl, setConfirmationLetterUrl] = useState("")

  const [sorting, setSorting] = useState<SortingState>([]);
  const [, setPartialLoading] = useState(false);

  const alumniDetail = (row : ITableData) => (
    <Stack alignItems='center'>
        <IconButton onClick={() => handleClickOpenEvidence(row)}>
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
            cell: info => format(info.getValue() as string,"dd MMMM yyyy")
          },
          {
              accessorKey: 'endYear',
              header: 'Duty Period (End Date)',
              cell: info => format(info.getValue() as string,"dd MMMM yyyy")
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
              accessorKey: 'status',
              header: 'Status',
            },
            {
              accessorKey : 'sendBackReason',
              header: 'Send Back Reason'
            },
            {
              accessorKey: 'id',
              header: 'Evidence',
              size: 1,
              enableSorting: false,
              cell: info => alumniDetail(info.row.original),
          },
      ],[data, pagination]
  )

  const getData = useCallback(  
    async (query: string, sort?: SortingState, page?: PaginationState) => {
        const url = `${ApiService.alumniAssociation}/get-approved-alumni-association?type=add&${query}&startDate=${startDate}&endDate=${endDate}`;
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
    getFileUrl(row.id);
  };

  return (
    <Stack>
        <Box sx={{ width: '100%' }}>
          {serverTable}

          <ViewEvidence
            openEvidence={openEvidence}
            handleClose={() => setOpenEvidence(false)}
            rowViewed={rowViewed}
            confirmationLetterUrl={confirmationLetterUrl}
            imageUrl={imageUrl}
            />

      </Box>
          
    </Stack>
  );
}