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

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ListUserRoleTable } from "./Interface/ListUserTable";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
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

type ColumnType = ColumnDef<ListUserRoleTable>;

const getColumns = (
  setData,
  setLoading,
  userProfile,
  handleDelete
): ColumnType[] => {
  const columns: ColumnType[] = [
    {
      accessorKey: "no",
      header: "No",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];
  const hasPermission = userProfile.rolePermissions.some((permission) =>
    ["edit-user", "delete-user"].includes(permission.permissionName)
  );

  if (hasPermission) {
    columns.push({
      header: "Action",
      cell: ({ row }) => (
        <ActionCell
          row={row}
          setData={setData}
          setLoading={setLoading}
          handleDelete={handleDelete}
        />
      ),
    });
  }

  return columns;
};

function ActionCell({ row, setData, setLoading, handleDelete }) {
  const Navigate = useNavigate();
  const userProfile = useSelector(selectProfile);

  const editCell = () => {
    Navigate(`/edit-user/${row.original.trUserRoleId}`);
  };

  const deleteCell = async () => {
    handleDelete(row.original.trUserRoleId);
  };

  return (
    <Stack direction="row" gap="10px">
      {userProfile.rolePermissions.some(
        (permission) => permission.permissionName === "edit-user"
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
        (permission) => permission.permissionName === "delete-user"
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

export function ViewUserRoles() {
  const { userId } = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { showModal } = useModal();

  const userProfile = useSelector(selectProfile);
  const [userName, setUserName] = useState("");
  const [binusianId, setBinusianId] = useState("");

  const [headerPortalElement, setHeaderPortalElement] =
    useState<Element | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteUserRoleId, setDeleteUserRoleId] = useState(null);

  const [data, setData] = useState<ListUserRoleTable[]>([]);
  const [originalData, setOriginalData] = useState<ListUserRoleTable[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(false);

  const activeRole = useSelector(selectProfileActiveRole);

  const handleDelete = (userRoleId) => {
    setModalOpen(true);
    setDeleteUserRoleId(userRoleId);
  };

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

  const confirmDelete = async () => {
    setLoading(true);
    const response = await apiClient.delete(
      `${ApiService.userRoleDetail}/${deleteUserRoleId}`
    );
    if (response.status == 200) {
      // refetch user Profile and update redux stores
      refetchUserProfile();
      showModal({
        title: "Success",
        message: "User role deleted successfully",
        options: {
          variant: "success",
          onOk: () => {
            getUserRole();
            setLoading(false);
          },
        },
      });
    }
  };

  const columns = useMemo(
    () => getColumns(setData, setLoading, userProfile, handleDelete),
    [setData, setLoading, userProfile, handleDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.trUserRoleId,
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

  const getUserRole = async () => {
    console.log(userId);
    const response = await apiClient.get(`${ApiService.userRoleDetail}`, {
      params: { userId },
    });
    if (response.data.name == null) {
      Navigate(`/list-user`);
    }
    setUserName(response.data.name);
    setBinusianId(response.data.binusianId);
    console.log(response.data.binusianId);
    setData(response.data.userRoles);
    setOriginalData(response.data.userRoles);
  };

  useEffect(() => {
    getUserRole();
    const portalElement = document.querySelector("#header-portal-content");
    setHeaderPortalElement(portalElement);
  }, []);

  return (
    <PageWrapper>
      {headerPortalElement &&
        createPortal(
          <Typography display="inline" variant="h5">
            {userName}
          </Typography>,
          headerPortalElement
        )}
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
                onClick={() => Navigate(`/add-user/${binusianId}`)}
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
                            fontSize: "12px",
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
                        <TableCell key={cell.id} sx={{ fontSize: "12px" }}>
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
        message="Are you sure you want to delete this user role?"
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
