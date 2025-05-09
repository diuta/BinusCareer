import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    Stack,
    Typography} from '@mui/material';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCallback,useEffect, useMemo,  useState } from 'react';
import { useSelector } from 'react-redux';

import CustomLoadingButton from '../../../components/common/CustomLoadingButton';
import { ModalAlert } from '../../../components/common/modal-alert';
import ServerTableAjax from '../../../components/common/table_ajax/ServerTableAjax';
import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import useModal from '../../../hooks/use-modal';
import { selectProfile } from '../../../store/profile/selector';
import { ITableData } from '../interface/ApprovalRequestInterface';
import {SendBackPopUp} from './SendBackPopUp';
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

function AddRequestTable( { 
    searchValue,
    set, 
    reset, 
    pagination, 
    setPagination, 
    dataWatcher
} : { 
    searchValue: string , 
    set : boolean,
    reset : (data) => void,
    pagination,
    setPagination : (data) => void,
    dataWatcher : boolean
}) {
    const [tableData, setTableData] = useState<ITableData[]>([]);
    const [totalData, setTotalData] = useState<number>(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [, setPartialLoading] = useState(false);

    const [selected, setSelected] = useState<number[]>([]);
    const [rowViewed, setRowViewed] = useState<ITableData | null>(null);
    const [selectedName, setSelectedName] = useState<string[]>([])

    const [open, setOpen] = useState(false);
    const [openSendBack, setOpenSendBack] = useState(false);
    const [openApprove, setOpenApprove] = useState(false);

    const [imageUrl, setImageUrl] = useState("")
    const [confirmationLetterUrl, setConfirmationLetterUrl] = useState("")
    const [approveLoading, setApproveLoading] = useState(false);

    const { showModal } = useModal();
    const userProfile = useSelector(selectProfile);
    const { rolePermissions} = userProfile;
    const [roleName,setRoleName] =useState<string[]>([]);

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
                accessorKey: 'id',
                header: 'Evidence',
                size: 1,
                enableSorting: false,
                cell: info => alumniDetail(info.row.original),
            },
        ],[selected, tableData]
    )

    const handleClick = (isChecked, id: number) => {
        if (isChecked) {
            setSelected((prevSelected) => [...prevSelected, id]);
        } else {
            setSelected((prevSelected) => prevSelected.filter((selectedId) => selectedId !== id));
        }
    };

    const checkBox = (row : ITableData) => {
        const isItemSelected = selected.includes(row.id);
        
        return (
            <Checkbox
                color="primary"
                checked={isItemSelected}
                onChange={(e) => handleClick(e.target.checked, row.id)}
            />
        );
    }

    const setColumn = (columns : ColumnDef<ITableData>[]) => {
        const checkboxColumn : ColumnDef<ITableData> = 
        {
            id: "select",
            size: 1,
            enableSorting: false,
            cell: (info) => checkBox(info.row.original),
        };

        if (roleName.includes("approval-alumni-association")){
            columns.unshift(checkboxColumn)
        }

        return columns;
    }

    const getData = useCallback(  
        async (query: string, sort?: SortingState, page?: PaginationState) => {
            const url = `${ApiService.alumniAssociation}/get-approval-request-alumni-association?type=add&${query}`;
            const response = await apiClient.get(url).then(e => e.data);
            setTableData(response.listAlumniAssociationData);
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
        data: tableData, 
        columns: setColumn(column), 
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
            setOpen(true);
        })
    }

    const handleApprove = async () => {
        if(selected.length > 0){
            try{
                setApproveLoading(true)
                await apiClient.patch(`${ApiService.alumniAssociation}/approve-request`, {selected});
                showModal({
                    title: 'Success',
                    message: 'Data Request Approved Successfully',
                    options: { 
                        variant: 'success' ,
                        onOk: () => {
                            window.location.reload();
                        }
                    },
                  });
            } catch {
                showModal({
                    title: 'Failed',
                    message: 'Please try again',
                    options: { 
                        variant: 'failed',
                        onOk: () => setApproveLoading(false)
                    },
                });
            }
        }
    }

    const handleClickOpenEvidence = (row: ITableData) => {
        setRowViewed(row);
        getFileUrl(row.id)
    };

    const handleOpenSendBack = () => {
        if (selected.length > 0){
            const selectedData = tableData.filter((row) => selected.includes(row.id)).map((item) => item.userIn);
            setSelectedName(selectedData);
            setOpenSendBack(true);
        }
    }

    useEffect(() => {
        rolePermissions.map((item)=> (
            setRoleName((prevData)=>[...prevData, item.permissionName])
        ));
    }, [])
    
    return (
        <Stack>
            <Box sx={{ width: '100%', overflowX: 'auto'}}>
                {serverTable}

                {roleName.includes("approval-alumni-association") ? (
                    <Stack direction='row' sx={{ justifyContent: 'end' }} gap='30px' padding={2}>
                        <Button 
                        sx={{ background: 'linear-gradient(180deg, rgba(153,153,153,1) 0%, rgba(179,179,179,1) 100%)', color: 'white', width:'auto' }} 
                        disabled = {selected.length === 0}
                        onClick={() => handleOpenSendBack()}>
                            <Typography sx={{ fontSize: '13px' }}>
                                Send Back
                            </Typography>
                        </Button>
                        
                        <CustomLoadingButton
                            loading={approveLoading}
                            startIcon={approveLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
                            variant="contained"
                            sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', width:'auto'}}
                            size='medium'
                            onClick={() => setOpenApprove(true)}
                            disabled={approveLoading || selected.length === 0}
                        >
                            <Typography sx={{ fontSize: '13px' }}>{approveLoading ? 'Loading...' : 'Approve'}</Typography>
                        </CustomLoadingButton>
                    </Stack>
                ) : null}

                <SendBackPopUp
                selected={selected}
                recipient={selectedName}
                open={openSendBack}
                handleClose={() => setOpenSendBack(false)}
                />

                <ModalAlert
                variant="info"
                open={openApprove}
                title="Approval Confirmation"
                message='Are you sure want to approve this data?'
                buttonTitle="Confirm"
                cancelButton
                onOk={() => handleApprove()}
                onClose={() => setOpenApprove(false)}
                />

                <ViewEvidence
                openEvidence={open}
                handleClose={() => setOpen(false)}
                rowViewed={rowViewed}
                confirmationLetterUrl={confirmationLetterUrl}
                imageUrl={imageUrl}
                />

            </Box>
        </Stack>
       
    );
}

export default AddRequestTable;