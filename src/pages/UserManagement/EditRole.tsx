import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../../components/container/PageWrapper";
import { IFormValues } from "./Interface/IEditRoleInterface";
import {
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik, FormikErrors } from "formik";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import { setProfile, setActiveRole } from "../../store/profile/slice";
import { selectProfile } from "../../store/profile/selector";
import { selectAuthTokenAzureAD } from "../../store/authToken/selector";
import { useDispatch, useSelector } from "react-redux";
import { ModalAlert } from "../../components/common/modal-alert";
import jwtDecode from "jwt-decode";
import { ProfileUser } from "../../store/profile/types";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import useModal from "../../hooks/use-modal";
import axios from "axios";

export function EditRole() {
  const { roleId } = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { showModal } = useModal();
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const userProfile = useSelector(selectProfile);
  const azureToken = useSelector(selectAuthTokenAzureAD);

  const [roleData, setRoleData] = useState<IFormValues>();

  const validate = (values: IFormValues) => {
    const errors: FormikErrors<IFormValues> = {};

    if (!values.roleName || values.roleName == "") {
      errors.roleName = "Required";
    }

    if (!values.roleDescription || values.roleDescription == "") {
      errors.roleDescription = "Required";
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
      roleId: 0,
      roleName: "",
      roleDescription: "",
    },
    onSubmit: async (values) => {
      setButtonLoading(true);
      try {
        const response = await apiClient.patch(
          `${ApiService.role}/${roleId}`,
          values
        );
        if (response.status === 200) {
          refetchUserProfile();
          setModalOpen(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            showModal({
              title: "Add Role",
              message: "Role name already exists",
              options: { variant: "failed" },
            });
          }
        } else {
          console.log("An unexpected error occurred.");
        }
      } finally {
        setButtonLoading(false);
      }
    },
    validate,
  });

  const getEditRole = async () => {
    const response = await apiClient.get(`${ApiService.role}/${roleId}`, {
      params: { roleId },
    });
    setRoleData(response.data);
  };

  useEffect(() => {
    setPageLoading(true);
    getEditRole();
    setPageLoading(false);
  }, []);

  useEffect(() => {
    formik.setFieldValue("userUp", userProfile?.userId || "");
    formik.setFieldValue("roleId", roleData?.roleId);
    formik.setFieldValue("roleName", roleData?.roleName);
    formik.setFieldValue("roleDescription", roleData?.roleDescription);
  }, [roleData]);

  const resetForm = () => {
    Navigate("/view-role");
  };

  return (
    <PageWrapper>
      {pageLoading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <Stack>
              <Typography variant="label">Role Name</Typography>
              <TextField
                id="roleName"
                variant="outlined"
                value={formik.values.roleName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.roleName && formik.touched.roleName ? (
                <Typography sx={{ color: "red" }}>
                  {formik.errors.roleName}
                </Typography>
              ) : null}
            </Stack>
            <Stack>
              <Typography variant="label">Role Description</Typography>
              <TextField
                id="roleDescription"
                variant="outlined"
                value={formik.values.roleDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.roleDescription &&
              formik.touched.roleDescription ? (
                <Typography sx={{ color: "red" }}>
                  {formik.errors.roleDescription}
                </Typography>
              ) : null}
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
          </Stack>
        </form>
      )}
      <ModalAlert
        variant="success"
        title="Success"
        message="Role has been editted successfully"
        buttonTitle="Confirm"
        open={modalOpen}
        onOk={() => Navigate("/view-role")}
        onClose={() => setModalOpen(false)}
      />
    </PageWrapper>
  );
}
