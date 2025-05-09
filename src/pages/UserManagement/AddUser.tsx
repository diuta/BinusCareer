import { useState } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import {
  Stack,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import { AddUserTable } from "./Interface/AddUserTable";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService";
import apiClient from "../../config/api-client";

const columns: ColumnDef<AddUserTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    header: "Action",
    cell: ActionCell,
  },
];

function ActionCell({ row }) {
  console.log(row.original);
  const Navigate = useNavigate();
  const AddCell = () => {
    Navigate(`/add-user/${row.original.binusianID}`);
  };

  return (
    <Stack direction="row" gap="10px">
      <Button onClick={AddCell} name="edit" variant="contained">
        Add
      </Button>
    </Stack>
  );
}

export function AddUser() {
  // table states
  const [data, setData] = useState<AddUserTable[]>([]);
  const [originalData, setOriginalData] = useState<AddUserTable[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // form states
  const [findUser, setfindUser] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false); // Flag for search initiation

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    getSortedRowModel: getSortedRowModel(),
  });
  const totalRows = table.getPrePaginationRowModel().rows.length;

  const handleSearchTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = originalData.filter((user) =>
      Object.values(user).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(searchTerm)
      )
    );
    setData(filteredData);
  };

  const getUser = async () => {
    setSearchInitiated(true); // Mark that a search was initiated
    const response = await apiClient.get(ApiService.user, {
      params: { searchKeyword: findUser },
    });
    setData(response.data);
    setOriginalData(response.data);
  };

  return (
    <PageWrapper>
      <Stack sx={{ mx: "auto", width: "100%" }}>
        <Stack width="100%" sx={{ paddingBottom: "20px" }}>
          <Typography variant="label">Name/Email</Typography>
          <Stack direction="row" gap="10px">
            <TextField
              sx={{ width: "100%" }}
              onChange={(e) => setfindUser(e.target.value)}
            />
            <Button variant="contained" onClick={getUser}>
              Search
            </Button>
          </Stack>
        </Stack>

        {searchInitiated && originalData.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "20px" }}
          >
            User not found
          </Typography>
        ) : (
          searchInitiated && (
            <Stack>
              <Stack
                direction="row"
                justifyContent="end"
                width="100%"
                sx={{ mx: "auto", marginBottom: "10px", marginTop: "20px" }}
              >
                <Stack direction="row" gap="20px">
                  <Typography sx={{ marginY: "auto" }}>Search: </Typography>
                  <TextField
                    variant="outlined"
                    placeholder="Search By"
                    onChange={handleSearchTable}
                  />
                </Stack>
              </Stack>
              <Stack
                direction="column"
                sx={{
                  flexGrow: 1,
                  overflow: "auto",
                  background: "white",
                  border: "1px solid #CCCCCC",
                }}
              >
                <TableContainer sx={{ minHeight: "400px" }}>
                  <Table>
                    <TableHead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableCell
                              key={header.id}
                              onClick={header.column.getToggleSortingHandler()}
                              sx={{ cursor: "pointer", fontWeight: "bold" }}
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
                            <TableCell key={cell.id}>
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
                  <Typography sx={{ marginY: "auto" }}>
                    {totalRows} Results
                  </Typography>
                  <Stack direction="row" sx={{ marginY: "auto" }} gap="10px">
                    <Typography sx={{ marginY: "auto" }}>Show:</Typography>
                    <Select
                      value={pagination.pageSize}
                      onChange={(e) =>
                        table.setPageSize(Number(e.target.value))
                      }
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
                    <Typography sx={{ marginY: "auto" }}>Jump to:</Typography>
                    <Select
                      value={pagination.pageIndex}
                      onChange={(e) =>
                        table.setPageIndex(Number(e.target.value))
                      }
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
          )
        )}
      </Stack>
    </PageWrapper>
  );
}

ActionCell.propTypes = null;
