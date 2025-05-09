import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Dialog , DialogContent, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import qs from 'qs'
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiSolidFileExport } from "react-icons/bi";
import { useSelector } from "react-redux";
import { To, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import * as XLSX from "xlsx";

import CustomLoadingButton from "../../../components/common/CustomLoadingButton";
import ServerTableAjax from "../../../components/common/table_ajax/ServerTableAjax";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import useModal from "../../../hooks/use-modal";
import { selectProfile } from "../../../store/profile/selector";
import { IExportReportData, IReportFilterFormValue, ITableData } from "../interface/ReportInterface";

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

export default function ReportTable (
    { filters, 
        values, 
        set, 
        reset, 
        pagination, 
        setPagination, 
        dataWatcher 
    } : { 
        filters: string , 
        values : IReportFilterFormValue,
        set : boolean,
        reset : (data) => void,
        pagination,
        setPagination : (data) => void,
        dataWatcher : boolean
    }
) {
    const [reportData, setReportData] = useState<ITableData[]>([]);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [, setPartialLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    const [loadingExport, setLoadingExport] = useState(false);

    const userProfile = useSelector(selectProfile);
    const { rolePermissions} = userProfile;

    const [viewedRow, setViewedRow] = useState<ITableData | null>(null);
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("")
    const [confirmationLetterUrl, setConfirmationLetterUrl] = useState("")
    const [roleName,setRoleName] =useState<string[]>([]);

    const {showModal} = useModal();
    const Navigate = useNavigate();

    const alumniDetail = (row : ITableData) => (
        <Stack direction='row' justifyContent='space-around' alignItems='center'>
            <IconButton onClick={() => handleClickOpen(row)} sx={{ width:'36px', height:'36px', color: 'white', backgroundColor: 'orange', borderRadius: '999px', padding: ''  }}>
                <VisibilityIcon />
            </IconButton>
            {row.status === "Approved" && roleName.includes("edit-alumni-association") && row.leaderStatus === "Active" ? EditTableButton(`/alumni/association/edit/${row.id}`) : null}
        </Stack>
    )

    const EditTableButton = useCallback(
        (route : To) => (
            <Button
              variant="contained"
              sx={{
                borderRadius: '999px',
                width: '36px',
                height: '36px',
                minWidth: 'fit-content',
                padding: 0,
              }}
              onClick={() => Navigate(route)}
            >
              <EditIcon />
            </Button>
        ), [Navigate]
    );
      
    const columns = useMemo<ColumnDef<ITableData>[]> (  
    () => [
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
            accessorKey: 'nim',
            header: 'NIM',
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'yearStart',
            header: 'Duty Period (Start Date)',
            cell: info => formatDate(info.getValue() as string,"dd MMMM yyyy")
        },
        {
            accessorKey: 'yearEnd',
            header: 'Duty Period (End Date)',
            cell: info => formatDate(info.getValue() as string,"dd MMMM yyyy")
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
            accessorKey: 'activity',
            header: 'Last Activity',
            size: 400,
            enableSorting: false,
            cell: info => listActivity(info.row.original.activity),
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
            header: 'Action', 
            enableSorting: false,
            cell: info => alumniDetail(info.row.original),
        },
    ], [EditTableButton, pagination, reportData]);

    const getReportData = useCallback(  
        async (query: string, sort?: SortingState, page?: PaginationState) => {
            const param = {
              CampusId: values.campusId,
              FacultyId: values.facultyId,
              ProgramId: values.programId,
              DegreeId: values.degreeId,
              leaderStatus: values.leaderStatus
            };
            const url = `${ApiService.alumniAssociation}/report-alumni-association?${query}&${qs.stringify(param)}`;
            const response = await apiClient.get(url).then(e => e.data);
            setReportData(response.listDataReportAlumniAssocation);
            setTotalResults(response.totalData);
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
        data: reportData, 
        columns, 
        rowCount: totalResults,
        page: pagination,
        sort: sorting,
        isMultiSort: false,
        onTableChange: getReportData,
        pageReset: set,
        search: searchValue
    });

    const handleExport = async () => {
        setLoadingExport(true)
        const response = await apiClient.get(`${ApiService.alumniAssociation}/export-report-data?${filters}`)
        const exportData : IExportReportData[] = response.data.listGetExportReportAlumniAssociation;

        if (exportData.length > 0){
            const transformedData = exportData.map(item => ({
                Faculty: item.facultyName,
                "Alumni Program": item.alumniProgram,
                "Leader of Program" : item.leaderProgram,
                Degree: item.degree,
                "Leader Status" : item.leaderStatus,
                "Reason (Not Active)" : item.reasonNotActive,
                Status : item.status,
                NIM: item.nim,
                Name : item.name,
                "Entry Year": item.entryYear ? formatDate(item.entryYear,"yyyy") : "-",
                "Graduation Year": item.graduationYear ? formatDate(item.graduationYear,"yyyy") : "-",
                Email : item.email,
                "Phone Number": item.phoneNumber,
                "Created Date": formatDate(item.createdDate,"yyyy-MM-dd HH:mm"),
                "Duty Period (Start Date)" : formatDate(item.startPeriod,"dd MMMM yyyy"),
                "Duty Period (End Date)" : formatDate(item.endPeriod,"dd MMMM yyyy"),
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
    
            XLSX.writeFile(wb, "ReportAlumniAssociation.xlsx");
            
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

    const handleClickOpen = (row: ITableData) => {
        setViewedRow(row);
        getFileUrl(row.id)
    };

    const handleClose = () => {
        setOpen(false);
        setViewedRow(null);
    };

    const getFileUrl = (mappingLeaderId : number) => {
        apiClient.get(`${ApiService.alumniAssociation}/get-file-url?mappingLeaderId=${mappingLeaderId}`)
        .then(resp => {
            setImageUrl(resp.data.imageUrl)
            setConfirmationLetterUrl(resp.data.confirmationLetterUrl)
            setOpen(true);
        })
    }

    useEffect(()=>{
        rolePermissions.map((item)=> {
           setRoleName((prevData)=>[...prevData, item.permissionName])
        })
    },[])

    const handleSearch =  useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearchValue(searchTerm);
		reset(!set);
    }, 1000);

    return (
        <>
        {roleName.includes("export-alumni-association") ? (
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap="10px"
                margin="15px 0px"
            > 
                    <CustomLoadingButton
                    color="success"
                    loading={loadingExport}
                    startIcon={<BiSolidFileExport />}
                    onClick={() => handleExport()}
                    sx={{ fontSize:'13px' }}
                    >
                    Export
                    </CustomLoadingButton>
                <Stack direction="row" gap="10px" alignItems="center">
                    <Typography>Search:</Typography>
                    <TextField
                        variant="outlined"
                        placeholder="Search By"
                        onChange={(e) => handleSearch(e)}
                    />
                </Stack>
            </Stack>
        ) : (
            <Stack
                direction="row"
                justifyContent="end"
                alignItems="center"
                gap="10px"
                margin="15px 0px"
            >
                <Stack direction="row" gap="10px" alignItems="center">
                    <Typography>Search:</Typography>
                    <TextField
                        variant="outlined"
                        placeholder="Search By"
                        onChange={(e) => handleSearch(e)}
                    />
                </Stack>
            </Stack>
        )}
            {serverTable}

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    {viewedRow && (
                        <Stack minWidth='500px' minHeight='300px' justifyContent='center' >
                            <Stack alignItems='center' gap='10px'>
                                    <img 
                                src={`${ApiService.viewUploadedFile}?Uri=${imageUrl}`}
                                alt='Alumni'
                                style={{ width:'200px', height:'200px' , borderRadius:'50%'}}/>
                                <Typography fontWeight='bold' fontSize='14px'>{viewedRow.name}</Typography>
                                <Typography fontSize='14px'>{viewedRow.nim}</Typography>
                                <Stack direction='row' gap='20px' justifyContent='space-evenly' alignItems='center' width='100%'>
                                    <Stack gap='5px' alignItems='center'>
                                        <Typography color='#999999' fontSize='12px'>Phone Number</Typography>
                                        <Typography fontSize='12px'>{viewedRow.phoneNumber}</Typography>
                                    </Stack>
                                    <Stack gap='5px' alignItems='center'>
                                        <Typography color='#999999' fontSize='12px'>Email</Typography>
                                        <Typography fontSize='12px'>{viewedRow.email}</Typography>
                                    </Stack>
                                </Stack>
                                <Button
                                sx={{ background: 'linear-gradient(80deg, rgba(241,135,0,1) 54%, rgba(243,159,51,1) 100%)', color: 'white', width:'50%' , arginTop:'30px', height:'40px', padding: '20px', fontSize:'13px'}}
                                onClick={() => window.open(`${ApiService.viewUploadedFile}?Uri=${confirmationLetterUrl}`, '_blank')}
                                >
                                    DOWNLOAD CONFIRMATION LETTER
                                </Button>
                            </Stack>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}