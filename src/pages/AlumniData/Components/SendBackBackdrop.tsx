import {
  Typography,
  Stack,
  Backdrop,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { useFormik, FormikErrors } from "formik";
import {
  SendBackForm,
  RequestApprovalDetailData,
} from "../Interface/RequestApprovalInterface";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import useModal from "../../../hooks/use-modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SendBackBackdrop({
  open,
  onClose,
  approvalId,
  setButtonLoading,
  requestDetail,
}: {
  open: boolean;
  onClose: () => void;
  approvalId: string;
  setButtonLoading: (loading: boolean) => void;
  requestDetail: RequestApprovalDetailData;
}) {
  const { showModal } = useModal();
  const Navigate = useNavigate();
  const validate = (values: SendBackForm) => {
    const errors: FormikErrors<SendBackForm> = {};

    if (!values.sendBackReason) {
      errors.sendBackReason = "send back reason required";
    }

    return errors;
  };

  const formik = useFormik<SendBackForm>({
    initialValues: {
      approvalId,
      sendBackReason: "",
    },
    onSubmit: async (values) => {
      setButtonLoading(true);
      onClose();
      try {
        const response = await apiClient.post(
          `
          ${ApiService.requestApproval}/send-back`,
          values
        );
        if (response.data.resultCode == 200) {
          showModal({
            title: "Success",
            message: "This Request has been sent back sucessfully",
            options: {
              variant: "success",
              onOk: () => Navigate("/approval-request"),
            },
          });
        }
      } catch (error){
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            showModal({
              title: "Failed",
              message: "This request has already been reviewed",
              options: { 
                variant: "failed",
                onOk: () => {
                  window.location.reload();
                }
              },
            });
          }
        } else {
          console.log("An unexpected error occurred.");
        }
      }
    },
    validate,
  });

  return (
    <Backdrop open={open} onClick={onClose} sx={{ zIndex: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          sx={{ height: "340px", width: "460px", backgroundColor: "white" }}
          onClick={(event) => event.stopPropagation()}
        >
          <Stack
            direction="row"
            sx={{
              marginX: "20px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize="16" fontWeight="bold" color="initial">
              Send Back Reason
            </Typography>
          </Stack>
          <Divider sx={{ marginTop: "20px", marginBottom: "30px" }} />
          <Typography
            variant="body1"
            color="initial"
            sx={{ marginX: "20px", marginTop: "16px", fontSize: "12px" }}
          >
            Dear {requestDetail.requestor},
          </Typography>
          <Stack sx={{ marginX: "20px", marginTop: "16px" }}>
            <TextField
              name="sendBackReason"
              placeholder="Enter reason..."
              multiline
              rows={1}
              onChange={formik.handleChange}
            />
          </Stack>
          <Typography
            variant="body1"
            color="initial"
            sx={{ marginX: "20px", marginTop: "16px", fontSize: "12px" }}
          >
            Regards,
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{ marginX: "20px", fontSize: "12px" }}
          >
            ARO
          </Typography>
          <Stack
            direction="row"
            gap="20px"
            justifyContent="end"
            sx={{ margin: "20px" }}
          >
            <Button
              variant="contained"
              sx={{ background: "#999999" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </form>
    </Backdrop>
  );
}
