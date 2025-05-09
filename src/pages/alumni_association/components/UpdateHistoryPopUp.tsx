import CloseIcon from '@mui/icons-material/Close';
import { 
    Dialog, 
    DialogContent, 
    Divider, 
    IconButton, 
    Stack, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography 
} from "@mui/material";
import { ColumnDef,flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format, isValid } from "date-fns";
import { useMemo } from "react";

import { IViewUpdateHistoryData } from "../interface/ApprovalRequestInterface";

function changedData (row : IViewUpdateHistoryData,info : string) {
    const {fieldName} = row;
    if (row && fieldName === "Status"){
        return (
            <Typography sx={{ fontSize: '12px' }}>{info}</Typography>
        )
    }
    return(
        <Typography sx={{ fontSize: '12px' }}>{format(info as string,"dd MMMM yyyy")}</Typography>
    )
}

export default function UpdateHistoryModal({
    updateHistoryData,
    openUpdateHistory,
    handleClose
} : {
    updateHistoryData : IViewUpdateHistoryData[],
    openUpdateHistory : boolean,
    handleClose : () => void
}) {
    const column = useMemo<ColumnDef<IViewUpdateHistoryData>[]> (
        () => [
            {
                accessorKey: 'fieldName',
                header: 'Field Name',
              },
              {
                accessorKey: 'previousData',
                header: 'Previous Data',
                cell: info => changedData(info.row.original, info.getValue() as string)
              },
              {
                accessorKey: 'updatedData',
                header: 'Updated Data',
                cell: info => changedData(info.row.original, info.getValue() as string)
              },
              {
                accessorKey: 'timeUpdated',
                header: 'Updated Time',
                cell: info => {
                    const date = new Date(info.getValue() as string); // Ensure it's a Date object
                    return isValid(date) ? format(date, "dd MMMM yyyy, HH:mm") : 'Invalid Date'; // Format the date or handle invalid
                },
              },
              {
                accessorKey: 'userUpdated',
                header: 'Updated By',
              },
        ],[]
    )

    const table = useReactTable({
        data: updateHistoryData || [],
        columns : column,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Dialog open={openUpdateHistory} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent sx={{ maxHeight: '500px' }}>
                <Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight="bold" fontSize="16px">View Update History</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    </Stack>
                    <Divider sx={{ marginTop: "10px", marginBottom:'30px' }} />
                    <Stack>
                        <TableContainer sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table sx={{ borderCollapse: 'collapse' }}>
                                <TableHead>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <TableCell 
                                                    key={header.id} 
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                        border: '1px solid rgba(0, 0, 0, 0.2)',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell 
                                                    key={cell.id} 
                                                    sx={{
                                                        fontSize: '12px',
                                                        border: '1px solid rgba(0, 0, 0, 0.2)',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
