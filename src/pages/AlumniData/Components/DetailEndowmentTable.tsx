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
  getSortedRowModel,
} from "@tanstack/react-table";

import { AlumniDetailEndowmentData } from "../Interface/FindAlumniDataInterface";

const columns: ColumnDef<AlumniDetailEndowmentData>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "period",
    header: "Period",
  },
  {
    accessorKey: "activity",
    header: "Activity",
  },
  {
    accessorKey: "debit",
    header: "Debit",
  },
  {
    accessorKey: "kredit",
    header: "Kredit",
  },
];

export function DetailEndowmentTable({
  endowmentData,
}: {
  endowmentData: AlumniDetailEndowmentData[] | undefined;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data: endowmentData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    getSortedRowModel: getSortedRowModel(),
  });
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const totalDebit =
    endowmentData?.reduce((sum, item) => sum + (item.debit || 0), 0) || 0;
  const totalCredit =
    endowmentData?.reduce((sum, item) => sum + (item.kredit || 0), 0) || 0;

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
        Endowment
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
  );
}
