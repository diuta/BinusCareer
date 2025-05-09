import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
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
} from "@mui/material";
import { styled } from "@mui/system";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import NumberPagination from "../table_pagination/NumberPagination";
import { IServerTableConfiguration } from "./IServerTableAjax";

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
        <Typography variant="label" sx={{ marginBottom: "0 !important" }}>
          No Data Shown
        </Typography>
      </TableCell>
    </TableRow>
  );
}

function appendToQueryString(
  sorting: SortingState,
  pagination: PaginationState,
  search?: string
): string {
  const searchString = search ? `&search=${search}` : "";
  const params = sorting
    .map(
      (sort, index) =>
        `Sort[${index}].id=${
          sort.id.charAt(0).toUpperCase() + sort.id.slice(1)
        }&Sort[${index}].desc=${sort.desc}`
    )
    .join("&")
    .concat(
      `${sorting.length > 0 ? "&" : ""}index=${pagination.pageIndex}&limit=${
        pagination.pageSize
      }${searchString}`
    );

  return params;
}

export default function ServerTableAjax<TData>({
  data,
  columns,
  pageSizeOptions = [10, 20, 50],
  rowCount,
  page,
  sort,
  onTableChange,
  isMultiSort = false,
  maxTableHeight = "768px",
  pageReset = false,
  search = "",
  totalRowSelected,
}: IServerTableConfiguration<TData>) {
  const [sorting, setSorting] = useState<SortingState>(sort || []);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(page);
  const [oldIndex, resetIndex] = useState(pageReset);

  const { getRowModel, getHeaderGroups } = useReactTable({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { sorting, pagination },
    isMultiSortEvent: () => isMultiSort,
  });

  useEffect(() => {
    const callback = async () => {
      setLoading(true);
      const querystring = appendToQueryString(sorting, pagination, search);
      await onTableChange(querystring, sorting, pagination);
      setTimeout(() => setLoading(false), 500);
    };
    callback();
  }, [sorting, pagination, onTableChange]);

  useEffect(() => {
    if (pageReset !== oldIndex) {
      resetIndex(!oldIndex);
      setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
    }
  }, [pageReset]);

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
                      border: "1px solid lightgray",
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
                      <Typography fontWeight="bold" sx={{ fontSize: "12px" }}>
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
            {loading ? (
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "5rem",
                  }}
                >
                  <CircularProgress />
                </Box>
              </TableCell>
            ) : getRowModel().rows.length > 0 ? (
              getRowModel().rows.map((row) => (
                <StyledTableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        border: "1px solid lightgray",
                      }}
                    >
                      <Typography sx={{ fontSize: "12px" }}>
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
            )
          }
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          margin: "20px",
          alignItems: "center",
        }}
        gap={1}
      >
        {totalRowSelected !== undefined ? (
          <Typography
            variant="label"
            flexGrow={1}
            sx={{ margin: "auto 0 !important" }}
          >
            {totalRowSelected} Rows Selected
          </Typography>
        ) : null}

        <Typography variant="label" sx={{ margin: "auto 0 !important" }}>
          {rowCount} Results
        </Typography>

        <Typography sx={{ margin: "auto 0 !important" }} variant="label">
          Show:{" "}
        </Typography>
        <Select
          value={pagination.pageSize}
          className="pagination-select"
          onChange={(e) =>
            setPagination({ pageSize: Number(e.target.value), pageIndex: 0 })
          }
          sx={{
            width: 70,
            " .binus-InputBase-input": {
              padding: "7px 10px 6px 8px !important",
            },
          }}
          SelectDisplayProps={{ style: { fontSize: 12 } }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              <Typography variant="label" sx={{ marginBottom: "0 !important" }}>
                {size}
              </Typography>
            </MenuItem>
          ))}
        </Select>

        <NumberPagination
          pageIndex={pagination.pageIndex}
          pageCount={Math.ceil(rowCount / pagination.pageSize)}
          setPageIndex={(index) =>
            setPagination({ pageIndex: index, pageSize: pagination.pageSize })
          }
        />
      </Stack>
    </>
  );
}
