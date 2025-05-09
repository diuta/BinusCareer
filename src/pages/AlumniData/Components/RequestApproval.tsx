import {
  Typography,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useFormik, FormikErrors } from "formik";
import { IFormData } from "../Interface/IRequestApprovalInterface";
import { useEffect } from "react";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import { FindAlumniDataForm } from "../Interface/FindAlumniDataInterface";
import qs from "qs";
import useModal from "../../../hooks/use-modal";
import { useNavigate } from "react-router-dom";

interface RequestApprovalProps {
  jobDataChecked: boolean;
  domicileDataChecked: boolean;
  childDataChecked: boolean;
  filters: ReturnType<typeof useFormik<FindAlumniDataForm>>;
}

export default function RequestApproval({
  jobDataChecked,
  domicileDataChecked,
  childDataChecked,
  filters,
}: RequestApprovalProps) {
  const { showModal } = useModal();
  const navigate = useNavigate();

  const validate = (values: IFormData) => {
    const errors: FormikErrors<IFormData> = {};

    if (!values.requestReason) {
      errors.requestReason = "Request reason is required";
    }

    return errors;
  };

  const formik = useFormik<IFormData>({
    initialValues: {
      phoneNumberChecked: false,
      emailChecked: false,
      dateOfBirthChecked: false,
      placeOfBirthChecked: false,
      ipkChecked: false,
      requestReason: "",
      showJobData: false,
      showDomicileData: false,
      showChildData: false,
    },
    onSubmit: async (values) => {
      console.log(values);
      const response = await apiClient.post(
        `${ApiService.findAlumni}?${qs.stringify(filters.values)}`,
        values
      );
      console.log(response);
      if ((response.data.resultCode = 200)) {
        showModal({
          title: "Data Request Submitted Successfully",
          message:
            "Your Export Request is being processed, you will be notified once it is ready.",
          options: {
            variant: "success",
            onOk: () => {
              window.location.reload();
            },
          },
        });
      }
    },
    validate,
  });

  useEffect(() => {
    formik.setFieldValue("showJobData", jobDataChecked);
    formik.setFieldValue("showDomicileData", domicileDataChecked);
    formik.setFieldValue("showChildData", childDataChecked);
  }, [jobDataChecked, domicileDataChecked, childDataChecked]);

  return (
    <Stack sx={{ paddingTop: "20px" }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          direction="column"
          gap="20px"
          width="100%"
          sx={{
            overflow: "auto",
            background: "white",
            border: "1px solid #CCC",
            borderRadius: "6px",
            px: 4,
            py: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Request Confidential Data
          </Typography>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.phoneNumberChecked}
                  onChange={(e) =>
                    formik.setFieldValue("phoneNumberChecked", e.target.checked)
                  }
                />
              }
              label="Phone Number"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.emailChecked}
                  onChange={(e) =>
                    formik.setFieldValue("emailChecked", e.target.checked)
                  }
                />
              }
              label="Email"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.dateOfBirthChecked}
                  onChange={(e) =>
                    formik.setFieldValue("dateOfBirthChecked", e.target.checked)
                  }
                />
              }
              label="Date of Birth"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.placeOfBirthChecked}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "placeOfBirthChecked",
                      e.target.checked
                    )
                  }
                />
              }
              label="Place of Birth"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.ipkChecked}
                  onChange={(e) =>
                    formik.setFieldValue("ipkChecked", e.target.checked)
                  }
                />
              }
              label="IPK"
              sx={{
                marginY: "auto",
                "& .binus-Typography-root": { fontSize: 12 },
              }}
            />
          </Stack>
        </Stack>
        <Stack
          direction="column"
          gap="20px"
          width="100%"
          sx={{
            overflow: "auto",
            background: "white",
            border: "1px solid #CCC",
            borderRadius: "6px",
            px: 4,
            py: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ mt: 2 }}>
            Request Reason
          </Typography>
          <Stack sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              name="requestReason"
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldTouched("requestReason", true);
              }}
            />
            {formik.touched.requestReason && formik.errors.requestReason && (
              <Typography sx={{ color: "red" }}>
                {formik.errors.requestReason}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          gap="20px"
          sx={{ paddingTop: "20px" }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ background: "#999999" }}
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Export
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
