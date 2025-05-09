import { useState } from "react";
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
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnDef,
  Row,
  getSortedRowModel,
  Column,
} from "@tanstack/react-table";

import { AlumniDetailChildData } from "../Interface/FindAlumniDataInterface";

const columns: ColumnDef<AlumniDetailChildData>[] = [
  {
    accessorKey: "childName",
    header: "Name",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
];

export function DetailChildTable({
  childData,
}: {
  childData: AlumniDetailChildData[] | undefined;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data: childData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    getSortedRowModel: getSortedRowModel(),
  });
  const totalRows = table.getPrePaginationRowModel().rows.length;

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
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Child
      </Typography>
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
            {childData && childData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: "center", fontSize: 14 }}
                >
                  Data not found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{ fontSize: 12 }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
  );
}
