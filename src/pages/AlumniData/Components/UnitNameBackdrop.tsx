import {
  Typography,
  Stack,
  Backdrop,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useState, useMemo } from "react";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import { UnitNameData } from "../Interface/RequestApprovalInterface";

type ColumnType = ColumnDef<UnitNameData>;

const getColumns = (data: UnitNameData[]): ColumnType[] => {
  const columns: ColumnType[] = [
    {
      accessorKey: "campusName",
      header: "Campus",
    },
    {
      accessorKey: "facultyName",
      header: "Faculty",
    },
    {
      accessorKey: "programName",
      header: "Program",
    },
  ];

  return columns;
};

export default function UnitNameBackdrop({
  open,
  onClose,
  approvalId,
}: {
  open: boolean;
  onClose: () => void;
  approvalId: string;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<UnitNameData[]>([]);
  const [originalData, setOriginalData] = useState<UnitNameData[]>([]);

  const columns = useMemo(() => getColumns(data), [data]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  });

  const getUnitName = async () => {
    const response = await apiClient.get(
      `${ApiService.requestApproval}/unit-name`,
      {
        params: { approvalId },
      }
    );

    setData(response.data);
    setOriginalData(response.data);
  };

  useEffect(() => {
    if (open) {
      getUnitName();
    }
  }, [open]);

  return (
    <Backdrop open={open} onClick={onClose} sx={{ zIndex: 2 }}>
      <Stack
        sx={{
          width: "700px",
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid black",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Stack
          direction="column"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            background: "white",
            border: "1px solid #CCCCCC",
            maxHeight: "400px",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        sx={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px",
                          border: "1px solid lightgray",
                          minWidth: header.column.columnDef.size,
                        }}
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
              <TableBody sx={{ overflowX: "auto" }}>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        sx={{ fontSize: "12px", border: "1px solid lightgray" }}
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
          <Stack
            direction="row"
            gap="20px"
            justifyContent="flex-end"
            width="100%"
            sx={{ padding: 2 }}
          >
            <Typography sx={{ marginY: "auto", fontSize: "12px" }}>
              {data.length} Results
            </Typography>
            <Stack direction="row" sx={{ marginY: "auto" }} gap="10px">
              <Typography sx={{ marginY: "auto", fontSize: "12px" }}>
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
              page={pagination.pageIndex + 1}
              onChange={(_, page) => table.setPageIndex(page - 1)}
              color="primary"
              sx={{ marginY: "auto" }}
            />
            <Stack direction="row" sx={{ marginY: "auto" }} gap="10px">
              <Typography sx={{ marginY: "auto", fontSize: "12px" }}>
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
      </Stack>
    </Backdrop>
  );
}
