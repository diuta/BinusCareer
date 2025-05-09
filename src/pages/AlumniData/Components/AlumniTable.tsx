import {
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Select, 
  MenuItem,
  Pagination,
} from '@mui/material';
import { 
	flexRender, 
} from '@tanstack/react-table';

export function AlumniTable(
  { table, pagination, totalRows }: {
    table: any,
    pagination: any,
    totalRows: number
  }
) {

  return (
    <Stack direction='column' sx={{ flexGrow: 1, overflow: 'auto', background: 'white', border: '1px solid #CCCCCC'}}>
      <TableContainer sx={{minHeight: '400px'}}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} onClick={header.column.getToggleSortingHandler()} sx={{ cursor: 'pointer' , fontWeight:'bold'}}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction='row' gap='20px' justifyContent='flex-end' width="100%" sx={{ padding: 2 }}>
        <Typography sx={{marginY: 'auto'}}>{totalRows} Results</Typography>
        <Stack direction='row' sx={{marginY: 'auto'}} gap='10px'>
          <Typography sx={{marginY: 'auto'}}>Show:</Typography>
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
          onChange={(_, page) => table.setPageIndex(page-1)}
          color="primary"
          sx={{marginY: 'auto'}}
        />
        <Stack direction='row' sx={{ marginY: 'auto' }} gap='10px'>
          <Typography sx={{ marginY: 'auto' }}>Jump to:</Typography>
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