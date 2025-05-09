import { Button, MenuItem, Pagination, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ColumnDef, flexRender, getPaginationRowModel, getSortedRowModel, useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { To, useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatDate } from "date-fns";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import { IEndowmentTable } from "../Interface/IEndowmentTable";

export default function EndowmentTableForProminent ({ alumniId }: { alumniId: string }) {
    const [dataEndowment, setDataEndowment] = useState<IEndowmentTable[]>([]);

    const Navigate = useNavigate();

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const ViewEndowmentButton = useCallback(
        (route : To) => (
            <Stack>
                <Button
                variant="contained"
                color="primary"
                sx={{
                    borderRadius: '999px',
                    width:'30px', 
                    height:'30px',
                    minWidth: 'fit-content',
                    padding: 0,
                }}
                onClick={() => Navigate(route)}
                >
                    <VisibilityIcon sx={{ color: 'white', borderRadius: '100px', padding: '3px',width:'25px', height:'26px'}}/>
                </Button>
            </Stack>
        ), [Navigate]
    );
    
    const columns : ColumnDef<IEndowmentTable>[] = [
        {
            header:'No',
            cell: info => info.row.index + 1,
        },
        {
            accessorKey: 'period',
            header: 'Period',
            cell: info => formatDate(info.getValue() as string, 'd MMMM yyyy'),
        },
        {
            accessorKey: 'activity',
            header:'Activity',
        },
        {
            accessorKey: 'kredit',
            header:'Kredit',
        },
        {
            accessorKey: 'debit',
            header:'Debit',
        },
        {
        accessorKey: 'endowmentId',
        header: 'Action',
        size: 1,
        enableSorting: false,
        cell: info => ViewEndowmentButton(`/endowment/edit/${info.getValue()}`),
        },
    ];

    const table = useReactTable({
        data: dataEndowment ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination },
        getSortedRowModel: getSortedRowModel(),
      });

    const totalRows = table.getPrePaginationRowModel().rows.length;

    const totalDebit =
        dataEndowment?.reduce((sum, item) => sum + (item.debit || 0), 0) || 0;
    const totalCredit =
        dataEndowment?.reduce((sum, item) => sum + (item.kredit || 0), 0) || 0;


    const fetchData = useCallback(async () => {
        const response = await apiClient.get(
            `${ApiService.prominent}/list-endowment-by-nim?alumniId=${alumniId}`
        );
    
        const result = await response.data;
        setDataEndowment(result.data);
    }, [alumniId]);
    
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Stack
        direction="column"
        sx={{
            background: "white",
            borderRadius: "8px",
            border: "1px solid #CCCCCC",
            padding: 2,
            marginTop: "20px",
        }}
        >
            <TableContainer sx={{ maxHeight: "400px" }}>
                <Table>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                        <TableCell
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            sx={{ cursor: "pointer", fontWeight: "bold", fontSize: 12 }}
                        >
                            {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                            {{
                            asc: " 🔼",
                            desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} sx={{ fontSize: 12 }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <Stack justifyContent="center" flexDirection="row" padding={2}>
                <Typography sx={{ marginY: "auto" }} fontSize="14px" marginX="auto">
                Total Endowment:
                </Typography>
                <Typography sx={{ marginY: "auto" }} fontSize="14px" marginX="auto">
                {totalCredit - totalDebit}
                </Typography>
            </Stack>
            <Stack
                direction="row"
                gap="20px"
                justifyContent="flex-end"
                width="100%"
                sx={{ padding: 2 }}
            >
                <Typography variant="label" sx={{ marginY: "auto" }}>
                {totalRows} Results
                </Typography>
                <Stack direction="row" sx={{ marginY: "auto" }} gap="10px">
                <Typography variant="label" sx={{ marginY: "auto" }}>
                    Show:
                </Typography>
                <Select
                    value={pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    sx={{ width: 70 }}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
                </Stack>
                <Pagination
                count={table.getPageCount()}
                onChange={(_, page) => table.setPageIndex(page - 1)}
                color="primary"
                sx={{ marginY: "auto" }}
                />
                <Stack direction="row" sx={{ marginY: "auto" }} gap="10px">
                <Typography variant="label" sx={{ marginY: "auto" }}>
                    Jump to:
                </Typography>
                <Select
                    value={pagination.pageIndex}
                    onChange={(e) => table.setPageIndex(Number(e.target.value))}
                    sx={{ width: 70 }}
                >
                    {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <MenuItem key={i} value={i}>
                        {i + 1}
                    </MenuItem>
                    ))}
                </Select>
                </Stack>
            </Stack>
        </Stack>
    )
}