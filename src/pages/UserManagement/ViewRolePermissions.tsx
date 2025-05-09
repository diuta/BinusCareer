import { useEffect, useState, useMemo } from "react";
import PageWrapper from "../../components/container/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import {
  Stack,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid
} from "@mui/material";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  PermissionsTable,
  IFormValues,
  PermissionInterface
} from "./Interface/IRolePermissionsInterface";
import { ApiService } from "../../constants/ApiService";
import apiClient from "../../config/api-client";
import { useFormik } from "formik";
import { setProfile, setActiveRole } from "../../store/profile/slice";
import { selectProfile } from "../../store/profile/selector";
import { selectAuthTokenAzureAD } from "../../store/authToken/selector";
import { useDispatch, useSelector } from "react-redux";
import { ModalAlert } from "../../components/common/modal-alert";
import jwtDecode from "jwt-decode";
import { ProfileUser } from "../../store/profile/types";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import { Dropdown } from "../AlumniData/Interface/FindAlumniDataInterface";
import { set } from "lodash";

const mandatoryPermission = "0620a8cb-cd79-4448-8f3a-1bcf85867613";

const formatPermissionName = (name) =>
  name
    .split("-") // Split by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" ");


export function ViewRolePermissions() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { roleId } = useParams();
  const [roleName, setRoleName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [permissionOptions, setPermissionOptions] = useState<PermissionInterface[]>([]);

  const toggleAllPermissions = () => {
    if (formik.values.Permissions.length === permissionOptions.length) {
      // Deselect all except the mandatory permission
      formik.setFieldValue("Permissions", [mandatoryPermission]);
    } else {
      // Select all permissions, ensuring the mandatory one is included only once
      const allPermissionIds = permissionOptions.map(
        (permission) => permission.permissionId
      );

      // Combine and ensure unique values using spread operator
      const uniquePermissions = [...new Set([mandatoryPermission, ...allPermissionIds])];

      formik.setFieldValue("Permissions", uniquePermissions);
    }
  };

  const handleCheckboxChange = (permissionId: string) => {
    const currentPermissions = formik.values.Permissions;
    formik.setFieldValue(
      "Permissions",
      currentPermissions.includes(permissionId)
        ? currentPermissions.filter((id) => id !== permissionId)
        : [...currentPermissions, permissionId]
    );
  };

  const getPermissionOptions = async () => {
    setPageLoading(true);
    const options = await apiClient.get(ApiService.getPermissions);
    console.log(options);
    setPermissionOptions(options.data);

    const roleData = await apiClient.get(
      `${ApiService.rolePermission}/${roleId}`,
      { params: { roleId } }
    ); // this return the array of permissions for this role

    setRoleName(roleData.data.roleName);

    const initialPermissions = roleData.data.permissions.includes(mandatoryPermission)
      ? roleData.data.permissions
      : [...roleData.data.permissions, mandatoryPermission];

    formik.setFieldValue("roleId", roleData.data.roleId);
    formik.setFieldValue("Permissions", initialPermissions);
    setPageLoading(false);
  };

  useEffect(() => {
    getPermissionOptions();
  }, []);

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
      roleId: "",
      Permissions: [],
    },
    onSubmit: async (values) => {
      try {
        // console.log(values);
        setButtonLoading(true);
        const response = await apiClient.patch(
          `${ApiService.rolePermission}/${roleId}`,
          values
        );
        if (response.status === 200) {
          setModalOpen(true);
          refetchUserProfile();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const resetForm = () => {
    Navigate("/view-role");
  };

  return (
    <PageWrapper>
      {pageLoading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Stack sx={{ mx: "auto", width: "100%", background: "white", padding: "20px" }}>
            <Stack>Role Name: {roleName}</Stack>
            <Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.Permissions.length === permissionOptions.length}
                    onChange={toggleAllPermissions}
                    sx={{ marginY: "0" }}
                  />
                }
                label="Check all Permissions"
                sx={{
                  width: "auto",
                  "& .binus-Typography-root": { fontSize: 12 }
                }}
              />

              <Grid
                container
                spacing={2}
                paddingX="16px"
                marginTop="16px"
                direction="column"
                sx={{
                  flexWrap: "wrap",
                  maxHeight: {
                    xs: "1000px", // Extra small screens (mobile)
                    sm: "800px",  // Small screens
                    md: "700px",  // Medium screens (tablets)
                    lg: "600px",  // Large screens
                    xl: "500px",  // Extra large screens
                  },
                }}
              >
                {permissionOptions.map((permission) => (
                  <Grid item xs={4} key={permission.permissionId} sx={{ flexBasis: "33.33%" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.Permissions.includes(permission.permissionId)}
                          disabled={permission.permissionId === "0620a8cb-cd79-4448-8f3a-1bcf85867613"}
                          onChange={() => handleCheckboxChange(permission.permissionId)}
                          sx={{ paddingY: "0px", marginY: "0px" }}
                        />
                      }
                      label={formatPermissionName(permission.permissionName)}
                      sx={{
                        paddingY: "0px",
                        marginY: "0px",
                        "& .binus-Typography-root": { fontSize: 12 },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

            </Stack>
          </Stack>
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
            <CustomLoadingButton loading={buttonLoading} type="submit">
              Save
            </CustomLoadingButton>
          </Stack>
        </form>
      )}
      <ModalAlert
        variant="success"
        title="Success"
        message="Role Permissions has been editted successfully"
        buttonTitle="Confirm"
        open={modalOpen}
        onOk={() => Navigate("/view-role")}
        onClose={() => setModalOpen(false)}
      />
    </PageWrapper>
  );
}