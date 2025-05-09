import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../../components/container/PageWrapper";
import {
  IFormValues,
  StatusDropdown,
  Dropdown,
  IProgramTable,
} from "./Interface/IAddSelectUserInterface";
import {
  Typography,
  Stack,
  Select,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Pagination,
  CircularProgress,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik, FormikErrors } from "formik";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnDef,
  RowData,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  Column,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { setProfile, setActiveRole } from "../../store/profile/slice";
import { useDispatch } from "react-redux";
import { ModalAlert } from "../../components/common/modal-alert";
import jwtDecode from "jwt-decode";
import { ProfileUser } from "../../store/profile/types";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import { fontSize } from "@mui/system";

declare module "@tanstack/react-table" {
  // allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

const columns: ColumnDef<IProgramTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <Stack className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </Stack>
    ),
  },
  {
    accessorKey: "campusName",
    header: "Campus",
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "facultyName",
    header: "Faculty",
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "programName",
    header: "Program",
    meta: {
      filterVariant: "text",
    },
  },
];

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & React.ComponentPropsWithoutRef<
  typeof Checkbox
>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return <Checkbox sx={{ padding: 0 }} inputRef={ref} {...rest} />;
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: any;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  const filteredRows = table.getFilteredRowModel().rows;
  const uniqueValues = new Set<string>();

  filteredRows.forEach((row: any) => {
    const value = row.original[column.id];
    if (value !== undefined) {
      uniqueValues.add(value);
    }
  });

  const sortedUniqueValues = [...uniqueValues].sort().slice(0, 5000);
  // const sortedUniqueValues = [...column.getFacetedUniqueValues().keys()].sort().slice(0, 5000)

  return filterVariant === "select" ? (
    <Stack>
      <Select
        value={columnFilterValue?.toString() || ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {sortedUniqueValues.map((value) => (
          <MenuItem value={value} key={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  ) : filterVariant === "text" ? (
    <TextField
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search ${column.columnDef.header}`}
      size="small"
    />
  ) : null;
}

export function AddSelectUser() {
  const { binusianId } = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  // table states
  const [data, setData] = useState<IProgramTable[]>([]);
  const [userData, setUserData] = useState<IFormValues | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      select: (rows, id, filterValue) => true,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination, rowSelection, columnFilters },
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.mappingProgamId,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const totalRows = table.getPrePaginationRowModel().rows.length;

  // this will set the formik values everytime the rowSelection changes
  useEffect(() => {
    // make an array of all the selected rows's id
    const selectedIds = Object.keys(table.getSelectedRowModel().rowsById);
    formik.setFieldValue("mappingCampusProgramId", selectedIds);
  }, [table.getState().rowSelection]);

  // form states
  const [roleDropDown, setRoleDropDown] = useState<Dropdown[]>([]);
  const [pageloading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const getUserData = async () => {
    const response = await apiClient.get(`${ApiService.user}/${binusianId}`, {
      params: { binusianId },
    });
    setUserData(response.data);
    console.log(response.data);

    return response.data;
  };

  const getRoleDropdown = async () => {
    const response = await apiClient.get(ApiService.getRoleDropdown);
    setRoleDropDown(response.data.listDropdown);
  };

  const getPrograms = async () => {
    const response = await apiClient.get(ApiService.getCFPTable);
    setData(response.data.listProgram);
  };

  useEffect(() => {
    getUserData();
    getRoleDropdown();
    getPrograms();
  }, []);

  const validate = (values: IFormValues) => {
    const errors: FormikErrors<IFormValues> = {};

    if (!values.name) {
      errors.name = "Required";
    }

    if (!values.email) {
      errors.email = "Required";
    }

    if (!values.binusianId) {
      errors.binusianId = "Required";
    }

    if (!values.position) {
      errors.position = "Required";
    }

    if (values.mappingCampusProgramId.length === 0) {
      errors.mappingCampusProgramId = "Atleast one program must be selected";
    }

    if (!values.roleId) {
      errors.roleId = "Role is required";
    }

    if (!values.status) {
      errors.status = "Status is required";
    }

    return errors;
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

  const formik = useFormik<IFormValues>({
    initialValues: {
      userId: userData?.userId || "",
      name: userData?.name || "",
      email: userData?.email || "",
      binusianId: userData?.binusianId || "",
      position: userData?.position || "",
      mappingCampusProgramId: [],
      roleId: "",
      status: 1,
      existingRoles: userData?.existingRoles || [],
    },
    onSubmit: async (values) => {
      setButtonLoading(true);
      try {
        const response = await apiClient.post(
          `${ApiService.userRoleDetail}/${binusianId}`,
          values
        );
        if (response.data.resultCode == 200) {
          // refetch user Profile and update redux stores
          setModalOpen(true);
          refetchUserProfile();
        }
      } catch (error) {
        console.log(error);
      }
    },
    validate,
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        binusianId: userData.binusianId,
        position: userData.position,
        mappingCampusProgramId: [],
        roleId: userData.roleId,
        status: 1,
        existingRoles: userData.existingRoles,
      });
    }
  }, [userData]);

  const resetForm = () => {
    Navigate("/list-user");
  };

  return (
    <PageWrapper>
      {pageloading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Stack direction="row" gap="20px" sx={{ width: "100%" }}>
            <Stack sx={{ width: "100%" }}>
              <Typography variant="label">Name</Typography>
              <TextField
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                disabled
              />
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Typography variant="label">Email</Typography>
              <TextField
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                disabled
              />
            </Stack>
          </Stack>
          <Stack direction="row" gap="20px" sx={{ width: "100%" }}>
            <Stack sx={{ width: "100%" }}>
              <Typography variant="label">Binusian ID</Typography>
              <TextField
                name="binusianId"
                value={formik.values.binusianId}
                onChange={formik.handleChange}
                disabled
              />
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Typography variant="label">Position</Typography>
              <TextField
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                disabled
              />
            </Stack>
          </Stack>
          <Stack direction="row" gap="20px" sx={{ width: "100%" }}>
            <Stack sx={{ width: "100%" }}>
              <Typography variant="label">Role</Typography>
              <Select
                label="Role"
                name="roleId"
                value={formik.values.roleId}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.setFieldTouched("roleId", true);
                }}
                sx={{ width: "100%" }}
              >
                {roleDropDown.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    disabled={userData?.existingRoles
                      .map(String)
                      .includes(item.value)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.roleId && formik.touched.roleId ? (
                <Typography sx={{ color: "red" }}>
                  {formik.errors.roleId}
                </Typography>
              ) : null}
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Typography variant="label">Status</Typography>
              <Select
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ width: "100%" }}
              >
                {StatusDropdown.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.status && formik.touched.status ? (
                <Typography sx={{ color: "red" }}>
                  {formik.errors.status}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
          <Stack
            direction="column"
            sx={{
              flexGrow: 1,
              overflow: "auto",
              background: "white",
              border: "1px solid #CCCCCC",
              marginTop: "20px",
            }}
          >
            <TableContainer sx={{ minHeight: "400px" }}>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id} sx={{ fontSize: "12px" }}>
                          <Stack
                            onClick={header.column.getToggleSortingHandler()}
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </Stack>
                          {header.column.getCanFilter() && (
                            <Stack>
                              <Filter column={header.column} table={table} />
                            </Stack>
                          )}
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
              justifyContent="space-between"
              width="100%"
              sx={{ padding: 2 }}
            >
              <Stack>
                <Typography variant="label" sx={{ marginY: "auto" }}>
                  {table.getSelectedRowModel().rows.length} Rows Selected
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="center" gap="20px">
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
                    sx={{ width: 70, padding: 0 }}
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
                  sx={{
                    marginY: "auto",
                  }}
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
          {formik.errors.mappingCampusProgramId ? (
            <Typography sx={{ color: "red" }}>
              {formik.errors.mappingCampusProgramId}
            </Typography>
          ) : null}
          <Stack
            sx={{ paddingTop: "20px" }}
            direction="row"
            justifyContent="end"
            gap="20px"
          >
            <Button
              variant="contained"
              sx={{ background: "grey" }}
              onClick={() => resetForm()}
            >
              Cancel
            </Button>
            {/* <Button type="submit" variant='contained'>Save</Button> */}
            <CustomLoadingButton loading={buttonLoading} type="submit">
              Save
            </CustomLoadingButton>
          </Stack>
        </form>
      )}
      <ModalAlert
        variant="success"
        title="Success"
        message="User role has been added successfully"
        buttonTitle="Confirm"
        open={modalOpen}
        onOk={() => Navigate("/list-user")}
        onClose={() => setModalOpen(false)}
      />
    </PageWrapper>
  );
}
