import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import NumberPagination from '../table_pagination/NumberPagination';
import { ITableConfiguration } from './ITable';

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#fafafa',
  },
}));

function TableNoDataRow({
  colLength,
}: {
  colLength: number;
}): React.ReactElement {
  return (
    <TableRow>
      <TableCell
        colSpan={colLength}
        sx={{
          textAlign: 'center',
          border: 1,
          borderColor: 'lightgray',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
          No Data Shown
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default function TableClientSide<TData>({
  data,
  columns,
  columnVisibility,
  pageSizeOptions = [10, 20, 50],
  initialPageSize = 10,
  isMultiSort = false,
  maxTableHeight = '768px',
  loading = false,
  pageReset = false,
}: ITableConfiguration<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [oldIndex, resetIndex] = useState(pageReset);

  const {
    getRowModel,
    getHeaderGroups,
    getPageCount,
    setPageSize: updatePageSize,
  } = useReactTable({
    data,
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    initialState: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    isMultiSortEvent: () => isMultiSort,
  });

  useEffect(() => {
    setPageIndex(0);
    updatePageSize(pageSize);
  }, [pageSize, updatePageSize]);

  useEffect(() => {
    if (pageReset !== oldIndex) {
      resetIndex(!oldIndex);

      setPageIndex(currentPage => {
        if (currentPage === 0) return 0;

        const maxPage = Math.ceil(data.length / pageSize) - 1;

        if (maxPage < currentPage) {
          return currentPage - 1;
        }

        return currentPage;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageReset]);

  return (
    <>
      <TableContainer
        sx={{
          overflow: 'auto',
          color: 'white',
          maxHeight: maxTableHeight,
        }}
      >
        <Table>
          <TableHead sx={{ width: '100%' }}>
            {getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 'bold',
                      border: 1,
                      borderColor: 'lightgray',
                      minWidth: header.column.columnDef.size,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      backgroundColor: 'white',
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="label"
                        sx={{ marginBottom: '0 !important' }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Typography>

                      {header.column.getCanSort() && (
                        <Box
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '8px',
                            height: '38px',
                            width: '14px',
                          }}
                        >
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 28,
                              position: 'absolute',
                              top: 0,
                              color:
                                header.column.getIsSorted() === 'asc'
                                  ? 'black'
                                  : '#ccc',
                              zIndex:
                                header.column.getIsSorted() === 'asc' ? 1 : 0,
                            }}
                          />
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 28,
                              position: 'absolute',
                              bottom: 0,
                              color:
                                header.column.getIsSorted() === 'desc'
                                  ? 'black'
                                  : '#ccc',
                              zIndex:
                                header.column.getIsSorted() === 'desc' ? 1 : 0,
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '5rem',
                  }}
                >
                  <CircularProgress />
                </Box>
              </TableCell>
            ) : getRowModel().rows.length > 0 ? (
              getRowModel().rows.map(row => (
                <StyledTableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        border: 1,
                        borderColor: 'lightgray',
                      }}
                    >
                      <Typography
                        variant="label"
                        sx={{ marginBottom: '0 !important' }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Typography>
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <TableNoDataRow colLength={columns.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        justifyContent="flex-end"
        margin="20px"
        sx={{
          alignItems: 'center',
        }}
        gap={1}
      >
        <Typography
          variant="label"
          marginRight="10px"
          sx={{ marginBottom: '0 !important' }}
        >
          {data.length} Results
        </Typography>

        <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
          Show:
        </Typography>
        <Select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          sx={{ width: 70 }}
        >
          {pageSizeOptions.map(size => (
            <MenuItem key={size} value={size}>
              <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
                {size}
              </Typography>
            </MenuItem>
          ))}
        </Select>

        <NumberPagination
          pageIndex={pageIndex}
          pageCount={getPageCount()}
          setPageIndex={setPageIndex}
        />
      </Stack>
    </>
  );
}
