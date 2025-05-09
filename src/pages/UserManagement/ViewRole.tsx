import { useEffect, useState, useMemo } from "react";
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
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ListRoleTable } from "./Interface/ListRoleTable";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../constants/ApiService";
import apiClient from "../../config/api-client";
import { setProfile, setActiveRole } from "../../store/profile/slice";
import {
  selectProfile,
  selectProfileActiveRole,
} from "../../store/profile/selector";
import { selectAuthTokenAzureAD } from "../../store/authToken/selector";
import { useDispatch, useSelector } from "react-redux";
import { ModalAlert } from "../../components/common/modal-alert";
import jwtDecode from "jwt-decode";
import { ProfileUser } from "../../store/profile/types";
import useModal from "../../hooks/use-modal";

type ColumnType = ColumnDef<ListRoleTable>;

const getColumns = (userProfile, handleDelete): ColumnType[] => {
  const columns: ColumnType[] = [
    {
      accessorKey: "roleName",
      header: "Role Name",
    },
    {
      accessorKey: "roleDescription",
      header: "Role Description",
    },
    {
      accessorKey: "totalUsers",
      header: "Total User",
    },
    {
      accessorKey: "totalPermission",
      header: "Total Permission",
    },
  ];

  // ini harus kaya gini soalnya ada kondisi kalo ga ada permission kolom action diilangin
  const hasPermission = userProfile.rolePermissions.some((permission) =>
    ["assign-role-permission", "edit-role", "delete-role"].includes(
      permission.permissionName
    )
  );

  if (hasPermission) {
    columns.push({
      header: "Action",
      cell: ({ row }) => <ActionCell row={row} handleDelete={handleDelete} />,
    });
  }

  return columns;
};

function ActionCell({ row, handleDelete }) {
  const Navigate = useNavigate();
  const userProfile = useSelector(selectProfile);

  const permissions = () => {
    Navigate(`/role-permission/${row.original.roleId}`);
  };

  const editCell = () => {
    Navigate(`/edit-role/${row.original.roleId}`);
  };

  const deleteCell = async () => {
    handleDelete(row.original.roleId);
  };

  return (
    <Stack direction="row" gap="10px">
      {userProfile.rolePermissions.some(
        (permission) => permission.permissionName === "assign-role-permission"
      ) && (
        <Button
          onClick={permissions}
          name="edit"
          variant="contained"
          sx={{
            minWidth: "30px",
            padding: "0px",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
          }}
        >
          <SettingsIcon />
        </Button>
      )}
      {userProfile.rolePermissions.some(
        (permission) => permission.permissionName === "edit-role"
      ) && (
        <Button
          onClick={editCell}
          name="edit"
          variant="contained"
          sx={{
            minWidth: "30px",
            padding: "0px",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
          }}
        >
          <EditIcon />
        </Button>
      )}
      {userProfile.rolePermissions.some(
        (permission) => permission.permissionName === "delete-role"
      ) && (
        <Button
          onClick={deleteCell}
          name="delete"
          variant="contained"
          sx={{
            minWidth: "30px",
            padding: "0px",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
          }}
        >
          <DeleteIcon />
        </Button>
      )}
    </Stack>
  );
}

export function ViewRole() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { showModal } = useModal();

  const userProfile = useSelector(selectProfile);
  const activeRole = useSelector(selectProfileActiveRole);
  const azureToken = useSelector(selectAuthTokenAzureAD);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);

  const [data, setData] = useState<ListRoleTable[]>([]);
  const [originalData, setOriginalData] = useState<ListRoleTable[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const refetchUserProfile = async () => {
    const response = await apiClient.get(ApiService.getProfile);

    const decodedToken = jwtDecode<ProfileUser>(response.data);

    if (typeof decodedToken.organizationRoles === "string") {
      decodedToken.organizationRoles = JSON.parse(
        decodedToken.organizationRoles
      );
    }

    const userProfileData: ProfileUser = {
      userId: decodedToken.userId,
      binusianId: decodedToken.binusianId,
      fullName: decodedToken.fullName,
      position: decodedToken.position,
      email: decodedToken.email,
      currentRole: decodedToken.currentRole,
      currentRoleDetailId: decodedToken.currentRoleDetailId,
      rolePermissions: [],
      organizationRoles: [],
    };

    if (Array.isArray(decodedToken.organizationRoles)) {
      userProfileData.organizationRoles = decodedToken.organizationRoles.map(
        (role: any) => ({
          roleId: role.roleId,
          roleName: role.roleName,
          roleDesc: role.roleDesc,
        })
      );
    }

    const permissions = await apiClient.get(ApiService.getCurrentPermissions);
    userProfileData.rolePermissions = permissions.data;

    dispatch(setProfile(userProfileData));

    if (userProfileData.organizationRoles) {
      const findRole = userProfileData.organizationRoles.find(
        (role) => role.roleId.toString() === userProfileData.currentRole
      );
      if (findRole) {
        dispatch(setActiveRole(findRole));
      }
    }
  };

  const handleDelete = (roleId) => {
    setModalOpen(true);
    setDeleteRoleId(roleId);
  };

  const confirmDelete = async () => {
    setModalOpen(false);
    setLoading(true);
    const response = await apiClient.delete(
      `${ApiService.role}/${deleteRoleId}`
    );
    if (response.status == 200) {
      // refetch user Profile and update redux stores
      refetchUserProfile();
      showModal({
        title: "Success",
        message: "User role deleted successfully",
        options: {
          variant: "success",
        },
      });
    }
    getRoleData();
    setLoading(false);
  };

  const columns = useMemo(
    () => getColumns(userProfile, handleDelete),
    [userProfile, handleDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.roleId,
  });
  const totalRows = table.getPrePaginationRowModel().rows.length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = originalData.filter((user) =>
      Object.values(user).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(searchTerm)
      )
    );
    setData(filteredData);
  };

  const getRoleData = async () => {
    const response = await apiClient.get(ApiService.role);
    setData(response.data);
    setOriginalData(response.data);
  };

  useEffect(() => {
    getRoleData();
  }, []);

  return (
    <PageWrapper>
      {loading ? (
        <CircularProgress />
      ) : (
        <Stack sx={{ mx: "auto", width: "100%" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            sx={{ mx: "auto", marginBottom: "10px" }}
          >
            <Stack>
              <Button
                variant="contained"
                sx={{ display: "flex", gap: "10px" }}
                onClick={() => Navigate("/add-role")}
              >
                <AddIcon />
                Add
              </Button>
            </Stack>
            <Stack direction="row" gap="20px">
              <Typography sx={{ marginY: "auto" }}>Search: </Typography>
              <TextField
                variant="outlined"
                placeholder="Search By"
                onChange={handleSearch}
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
                          sx={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: 12,
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
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
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
        </Stack>
      )}
      <ModalAlert
        variant="info"
        title="Confirmation"
        message="Are you sure you want to delete this role?"
        buttonTitle="Confirm"
        open={modalOpen}
        cancelButton
        onOk={() => confirmDelete()}
        onClose={() => setModalOpen(false)}
      />
    </PageWrapper>
  );
}

ActionCell.propTypes = null;
