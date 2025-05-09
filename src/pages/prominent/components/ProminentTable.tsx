import { Button, Stack, TextField, Typography } from "@mui/material";
import { To, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { format, formatDate } from "date-fns";
import TableAjax from "../../../components/common/table_ajax/TableAjax";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "../../../store/profile/selector";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import * as XLSX from "xlsx";
import CustomLoadingButton from "../../../components/common/CustomLoadingButton";
import { BiSolidFileExport } from "react-icons/bi";
import useModal from "../../../hooks/use-modal";
import { IExportData, IProminentFilterFormValue, IRowData, ITableListProminent } from "../Interface/IListProminent";
import qs from 'qs'
import ServerTableAjax from "../../../components/common/table_ajax/ServerTableAjax";
import { useDebounce, useDebouncedCallback } from 'use-debounce';

function createData(
    item : IExportData,
    achievementEvidence : string,
    index : number,
    header : string,
    ) {
    return {
        Periode: item.period
        ? format(new Date(item.period), "dd/MM/yyyy")
        : "Invalid Date",
        Date: item.date
        ? format(new Date(item.date), "dd/MM/yyyy")
        : "Invalid Date",
        NIM: item.nim || "",
        Name: item.name || "",
        Campus: item.campus || "",
        Faculty: item.faculty || "",
        Program: item.program || "",
        Degree: item.degree || "",
        "Achievement Category": header === "Achievement" ? item.achievement?.[index].achievementCategory : "",
        Achievement: header === "Achievement" ? item.achievement?.[index].achievementName : "",
        "Achievement Evidence": header === "Achievement" ? achievementEvidence : "",
        "Binus Support": header === "Binus Support" ? item.binusSupport?.[index] : "",
        "Binus Contribution": header === "Engagement" ? item.binusContribution?.[index] : "",
        "Binus Contribution Value": header === "Engagement" ? (item.binusContributionValue.length > 0 ? item.binusContributionValue[index].toString() : "") : "",
        Endowment: header === "Endowment" ? item.endowmentName?.[index] : "",
        "Endowment Value": header === "Endowment" ? (item.endowmentValue.length > 0 ? item.endowmentValue[index].toString() : "") : "",
        Status: item.status|| "",
    };
}

export default function ProminentTable (
    { filters, 
        values, 
        set, 
        reset, 
        pagination, 
        setPagination, 
        dataWatcher 
    } : { 
        filters: string , 
        values : IProminentFilterFormValue,
        set : boolean,
        reset : (data) => void,
        pagination,
        setPagination : (data) => void,
        dataWatcher : boolean
    }
) {
    const [dataProminent, setDataProminent] = useState<ITableListProminent[]>([]);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [loadingExport, setLoadingExport] = useState(false);
    const [search, setSearch] = useState<string>('');
    const [roleName,setRoleName] =useState<string[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [, setPartialLoading] = useState(false);
    
    const userProfile = useSelector(selectProfile);
    const { currentRoleDetailId , rolePermissions} = userProfile;
    const {showModal} = useModal();
    const Navigate = useNavigate();

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
        ), [rolePermissions]
    );
      
      const columns = useMemo<ColumnDef<ITableListProminent>[]> (  
      () => [
        {
            accessorKey: 'period',
            header: 'Period',
            cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy'),
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy'),
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
            accessorKey: 'campus',
            header: 'Campus',
        },
        {
            accessorKey: 'faculty',
            header: 'Faculty',
        },
        {
            accessorKey: 'program',
            header: 'Program',
        },
        {
            accessorKey: 'degree',
            header: 'Degree',
        },
        {
            accessorKey: 'totalAchievement',
            header: 'Total Achievement',
            enableSorting: false,
        },
        {
            accessorKey: 'totalBinusSupport',
            header: 'Total Binus Support',
            sortingFn: 'basic',
            enableSorting: false,
        },
        {
            accessorKey: 'binusContribution',
            header: 'Binus Contribution',
            enableSorting: false,
        },
        {
            accessorKey: 'totalBinusContribution',
            header: 'Total Contribution Value',
            cell : info => `Rp ${new Intl.NumberFormat('en-ID').format(info.getValue() as number)},00`,
            enableSorting: false,
        },
        {
            accessorKey: 'endowment',
            header: 'Endowment',
            enableSorting: false,
        },
        {
            accessorKey: 'endowmentValue',
            header: 'Endowment Value',
            cell : info => `Rp ${new Intl.NumberFormat('en-ID').format(info.getValue() as number)},00`,
            enableSorting: false,
        },
        {
            accessorKey: 'lastUpdate',
            header: 'Last Update',
            cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy, HH:mm'),
        },
        {
            accessorKey: 'updatedBy',
            header: 'Updated By',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
        accessorKey: 'prominentId',
        header: 'Action',
        size: 1,
        enableSorting: false,
        cell: info => info.row.original.status === "Approved" && roleName.includes("edit-prominent") ? EditTableButton(`/prominent/edit/${info.getValue()}`) : null,
        },
    ], [EditTableButton, dataProminent, pagination]);

    const handleSearch =  useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearch(searchTerm);
		reset(!set);
    }, 1000);

    useEffect(() => {
        rolePermissions.map((item)=> {
            setRoleName((prevData)=>[...prevData, item.permissionName])
        });
    }, [])

    const getListProminent = useCallback(  
        async (query: string, sort?: SortingState, page?: PaginationState) => {
            const param = {
              CampusId: values.campusId,
              FacultyId: values.facultyId,
              ProgramId: values.programId,
              DegreeId: values.degreeId,
            };
            const url = `${ApiService.prominent}/list-prominent?${query}&${qs.stringify(param)}`;
            const response = await apiClient.get(url).then(e => e.data);
            setDataProminent(response.data);
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

    const serverTable = ServerTableAjax<ITableListProminent>({
        data: dataProminent, 
        columns, 
        rowCount: totalResults,
        page: pagination,
        sort: sorting,
        isMultiSort: false,
        onTableChange: getListProminent,
        pageReset: set,
        search
    });

    const handleExport = async () => {
        setLoadingExport(true)
        const response = await apiClient.get(`${ApiService.prominent}/data-export?${filters}`);
        const exportData : IExportData[] = response.data.listGetDataForExport;
        if (exportData.length > 0) {    
            const transformedData: IRowData[] = [];
            exportData.forEach((item, index) => {
                const achievementCount = item.achievement.length;
    
                for (let i = 0; i < achievementCount; i+=1) {
                const achievementEvidence =
                    item.achievement?.[i].achievementEvidence?.map((p) => `\u2022 ${p.evidence}`).join("\n") || "";
                transformedData.push(createData(item, achievementEvidence, i, "Achievement"));
                }
                for (let i = 0; i < item.binusSupport.length; i+=1) {
                transformedData.push(createData(item, "", i, "Binus Support"));
                }
                for (let i = 0; i < item.binusContribution.length; i+=1) {
                    transformedData.push(createData(item, "", i, "Engagement"));
                }
                for (let i = 0; i < item.endowmentName.length; i+=1) {
                    transformedData.push(createData(item, "", i, "Endowment"));
                }
            });
        
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
    
            XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    
            XLSX.writeFile(wb, "ListProminent_Prominent.xlsx");
            
            showModal({
                title: 'Export Data Success',
                message: 'Export Successful',
                options: { 
                    variant: 'success',
                    onOk: () => setLoadingExport(false)
                },
            });
        } else {
            showModal({
                title: 'Export Data Failed',
                message: 'No Prominent Data',
                options: { 
                    variant: 'failed',
                    onOk: () => setLoadingExport(false)
                },
            });
        }
        setLoadingExport(false);
    }
      
    return (
        <>
        {roleName.includes("export-prominent") ? (
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
                sx={{ fontSize:'13px' }}
                onClick={() => handleExport()}
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
        </>
    )
}