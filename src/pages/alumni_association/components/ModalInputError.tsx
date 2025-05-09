import { Box, Button, Dialog, DialogContent, MenuItem, Pagination, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

import { modalAlertStyle } from "../../../styles/common/modal-alert";

export default function ModalAlertInput (
    {
        nim,
        listError,
        listCheckPeriod,
        listStillActive,
        setListError
    } : {
        nim : string;
        listError : boolean;
        listCheckPeriod : string[];
        listStillActive : string[];
        setListError : (data) => void;
    }
) {
    const [error, setError] = useState<string[]>([]);
    const [totalError, setTotalError] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const totalPages = Math.ceil(totalError / rowsPerPage);

    useEffect(() => {
        let comb : string[] = [];
        if (listStillActive.length > 0) {
            comb = [...comb, ...listStillActive];
        }
        
        if (listCheckPeriod.length > 0) {
            comb = [...comb, ...listCheckPeriod];
        }
        setError(comb);
        setTotalError(comb.length);
    }, [listError])

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    
      const handleJumpToPage = (event) => {
        setPage(parseInt(event.target.value, 10));
    };
    
      const handleSelectPage = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Dialog open={listError} onClose={() => setListError(false)} maxWidth="sm" fullWidth>
            <DialogContent>
                <Stack>
                    <Stack alignItems='center' mb={2}>
                        <Box
                        component="img"
                        src="/assets/alert/ilustrasi-cody-failed.png"
                        sx={modalAlertStyle.modalAlertLogo}
                        />
                        <Typography variant="h4">Failed</Typography>
                        <Typography fontSize='14px'>Please check the following issues before continue</Typography>

                    </Stack>
                    {error.length > 0 && (
                        <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 , padding:'20px'}}>
                                <TableContainer sx={{ border: 'solid thin #D9D9D9'}}>
                                    <Table
                                        sx={{ minWidth: 750 }}
                                        aria-labelledby="tableTitle"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={{ fontWeight:600 , borderRight: 'solid thin #D9D9D9', fontSize:'12px'}}
                                                >
                                                    Campus - Program
                                                </TableCell>
                                                <TableCell
                                                    sx={{ fontWeight:600 , borderRight: 'solid thin #D9D9D9', fontSize:'12px'}}
                                                >
                                                    Notes
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {error.map((row) => (
                                            <TableRow>
                                                <TableCell
                                                sx={{
                                                    borderRight: 'solid thin #D9D9D9',
                                                    fontSize: '12px'
                                                }}
                                                >
                                                {row}
                                                </TableCell>
                                                <TableCell
                                                sx={{
                                                    borderRight: 'solid thin #D9D9D9',
                                                    fontSize: '12px'
                                                }}
                                                >
                                                {
                                                    listStillActive.includes(row)
                                                    ? "The program's leader is still active"
                                                    : listCheckPeriod.includes(row)
                                                    ? "You are only allowed to input the alumni program leader starting from 2 months before the previous term ends."
                                                    : ''
                                                }
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                
                                <Stack alignItems="end" p={2} gap='20px' >
                                    <Stack direction="row" alignItems="center" gap='10px'>
                                        <Typography>{totalError} Results</Typography>
                                        <Typography>Show:</Typography>
                                        <Select
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        sx={{width:'65px' }}
                                        >
                                        {[10, 20, 50, 100].map((rowsOption) => (
                                            <MenuItem key={rowsOption} value={rowsOption}>{rowsOption}</MenuItem>
                                        ))}
                                        </Select>
                                        <Stack spacing={2}>
                                            <Pagination count={totalPages} page={page} onChange={handleSelectPage}/> 
                                        </Stack>
                                        <Select
                                        value={page}
                                        onChange={handleJumpToPage}
                                        sx={{ width:'65px'}}
                                        >
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageOption) => (
                                            <MenuItem key={pageOption} value={pageOption}>{pageOption}</MenuItem>
                                        ))}
                                        </Select>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Box>
                    )}
                    <Stack direction='row' justifyContent='center'>
                        <Button onClick={() => setListError(false)} sx={{ background: 'linear-gradient(180deg, rgba(241,135,0,1) 31%, rgba(243,159,51,1) 100%)', color:'white', width:'100px', fontSize:'13px'}}>OK</Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>   
    )
}