import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

import { modalAlertStyle } from "../../../styles/common/modal-alert";

export function ModalAlertImport({
  variant = "success",
  open,
  message,
  title,
  buttonTitle,
  cancelButton = false,
  onOk,
  onClose,
  boxWidth,
}: {
  variant?: string;
  open: boolean;
  message?: string | ReactNode;
  title?: string;
  buttonTitle?: string;
  cancelButton?: boolean;
  onOk?: () => void;
  onClose?: () => void;
  boxWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(open);

  const content = {
    success: {
      title: "Success",
      icon: "/assets/alert/ilustrasi-cody-success.png",
    },
    failed: {
      title: "Failed",
      icon: "/assets/alert/ilustrasi-cody-failed.png",
    },
    info: { title: "Info", icon: "/assets/alert/ilustrasi-cody-alert.png" },
  };

  const handleClose = (_, reason = "closeClick") => {
    if (reason === "backdropClick") return;
    onClose?.();
    setIsOpen(false);
  };

  const handleOk = () => {
    onOk?.();
    handleClose(null, "okClick");
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      sx={modalAlertStyle.modalAlert}
      disableEnforceFocus
    >
      <Stack
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
          ...modalAlertStyle.modalAlertContainer,
          ...(boxWidth && { width: `${boxWidth}` }),
        }}
      >
        <Box
          component="img"
          src={content[variant].icon}
          sx={modalAlertStyle.modalAlertLogo}
        />
        <Stack sx={modalAlertStyle.modalAlertContent}>
          <Typography sx={modalAlertStyle.modalAlertTitle}>
            {title ? `${title}` : content[variant].title}
          </Typography>
          {typeof message === "string" ? (
            <Typography sx={modalAlertStyle.modalAlertDesc}>
              {message}
            </Typography>
          ) : (
            message
          )}
        </Stack>
        <Stack direction="row" gap="50px" justifyContent="center">
          {cancelButton && (
            <Button
              variant="contained"
              color="secondary"
              sx={modalAlertStyle.modalAlertButton}
              onClick={handleClose}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={modalAlertStyle.modalAlertButton}
            onClick={handleOk}
          >
            {buttonTitle ?? "Ok"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
