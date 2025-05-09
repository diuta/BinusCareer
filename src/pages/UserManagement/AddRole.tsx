import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/container/PageWrapper";
import { IFormValues } from "./Interface/IAddRoleInterface";
import { Typography, Stack, TextField, Button } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik, FormikErrors } from "formik";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profile/selector";
import { ModalAlert } from "../../components/common/modal-alert";
import CustomLoadingButton from "../../components/common/CustomLoadingButton";
import useModal from "../../hooks/use-modal";
import axios from "axios";

export function AddRole() {
  const Navigate = useNavigate();
  const { showModal } = useModal();
  const [pageLoading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const userProfile = useSelector(selectProfile);
  const validate = (values: IFormValues) => {
    const errors: FormikErrors<IFormValues> = {};

    if (!values.roleName) {
      errors.roleName = "Required";
    }

    if (!values.roleDescription) {
      errors.roleDescription = "Required";
    }

    return errors;
  };

  const formik = useFormik<IFormValues>({
    initialValues: {
      roleName: "",
      roleDescription: "",
    },
    onSubmit: async (values) => {
      setButtonLoading(true);
      try {
        const response = await apiClient.post(ApiService.role, values);
        if (response.data.resultCode == 200) {
          setModalOpen(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            showModal({
              title: "Failed",
              message: "Role name already exists",
              options: { variant: "info" },
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

  useEffect(() => {
    formik.setFieldValue("userIn", userProfile?.userId || "");
  }, []);

  const resetForm = () => {
    Navigate("/view-role");
  };

  return (
    <PageWrapper>
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
            {formik.errors.roleDescription && formik.touched.roleDescription ? (
              <Typography sx={{ color: "red" }}>
                {formik.errors.roleDescription}
              </Typography>
            ) : null}
          </Stack>
          <Stack
            sx={{ paddingTop: "20px" }}
            justifyContent="end"
            direction="row"
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
      <ModalAlert
        variant="success"
        title="Success"
        message="Role has been added successfully"
        buttonTitle="Confirm"
        open={modalOpen}
        onOk={() => Navigate("/view-role")}
        onClose={() => setModalOpen(false)}
      />
    </PageWrapper>
  );
}
