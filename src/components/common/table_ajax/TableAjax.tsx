import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Box,
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
} from "@mui/material";
import { styled } from "@mui/system";
import {
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import NumberPagination from "../table_pagination/NumberPagination";
import { ITableConfiguration } from "./ITableAjax";

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#fafafa",
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
        sx={{ textAlign: "center", border: 1, borderColor: "lightgray" }}
      >
        No Data Shown
      </TableCell>
    </TableRow>
  );
}

function appendSortingToQueryString(sorting: SortingState): string {
  const sortingParams = sorting
    .map(
      (sort, index) =>
        `sort[${index}].id=${
          sort.id.charAt(0).toUpperCase() + sort.id.slice(1)
        }&sort[${index}].desc=${sort.desc}`
    )
    .join("&");

  return sortingParams;
}

export default function TableAjax<TData>({
  data,
  columns,
  pageSizeOptions = [10, 20, 50],
  rowCount,
  page = 0,
  pageSize = 10,
  isMultiSort = false,
  maxTableHeight = "500px",
  onSortChange,
  onPageChange,
  onPageSizeChange,
}: ITableConfiguration<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { getRowModel, getHeaderGroups } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    isMultiSortEvent: () => isMultiSort,
  });

  useEffect(() => {
    const sortString = appendSortingToQueryString(sorting);

    onSortChange(sortString);
  }, [sorting, onSortChange]);

  useEffect(() => {
    onPageChange(page);
  }, [page, onPageChange]);

  useEffect(() => {
    onPageChange(0);
    onPageSizeChange(pageSize);
  }, [pageSize, onPageSizeChange, onPageChange]);

  return (
    <>
      <TableContainer
        sx={{
          overflow: "auto",
          color: "white",
          maxHeight: maxTableHeight,
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ width: "100%" }}>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: "bold",
                      border: 1,
                      borderColor: "lightgray",
                      minWidth: header.column.columnDef.size,
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "white",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography fontWeight="bold" fontSize='12px'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Typography>

                      {header.column.getCanSort() && (
                        <Box
                          sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "8px",
                            height: "38px",
                            width: "14px",
                          }}
                        >
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 28,
                              position: "absolute",
                              top: 0,
                              color:
                                header.column.getIsSorted() === "asc"
                                  ? "black"
                                  : "#ccc",
                              zIndex:
                                header.column.getIsSorted() === "asc" ? 1 : 0,
                            }}
                          />
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 28,
                              position: "absolute",
                              bottom: 0,
                              color:
                                header.column.getIsSorted() === "desc"
                                  ? "black"
                                  : "#ccc",
                              zIndex:
                                header.column.getIsSorted() === "desc" ? 1 : 0,
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
            {getRowModel().rows.length > 0 ? (
              getRowModel().rows.map((row) => (
                <StyledTableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        border: 1,
                        borderColor: "lightgray",
                      }}
                    >
                      <Typography fontSize='12px'>
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          row,
                        })}
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
        sx={{
          marginTop: "20px",
          marginRight: "20px",
          marginBottom: "20px",
          alignItems: "center",
        }}
        gap={1}
      >
        <Typography sx={{ marginRight: "10px" }}>{rowCount} Results</Typography>

        <Typography>Show: </Typography>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          sx={{ width: 70 }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>

        <NumberPagination
          pageIndex={page}
          pageCount={Math.ceil(rowCount / pageSize)}
          setPageIndex={onPageChange}
        />
      </Stack>
    </>
  );
}
