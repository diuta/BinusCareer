import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Stack } from "@mui/material";
import { useCallback,useState } from "react";
import { To,useNavigate } from "react-router-dom";

import { DeletePopUp } from "./DeletePopUp";

interface EditTableButtonProps {
  route: To;
  id: number;
  rolePermissions: { permissionName: string }[];
}

export function EditTableButton({ route, id, rolePermissions }: EditTableButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenPopup = useCallback(() => setIsPopupOpen(true), []);
  const handleClosePopup = useCallback(() => setIsPopupOpen(false), []);

  return (
    <Stack direction="row" gap="10px">
      {rolePermissions.some((item) => item.permissionName === "edit-engagement") && (
        <Button
          variant="contained"
          sx={{
            borderRadius: "999px",
            width: "36px",
            height: "36px",
            minWidth: "fit-content",
            padding: 0,
          }}
          onClick={() => navigate(route)}
        >
          <EditIcon />
        </Button>
      )}
      {rolePermissions.some((item) => item.permissionName === "delete-engagement") && (
        <>
          <Button
            variant="contained"
            sx={{
              borderRadius: "999px",
              width: "36px",
              height: "36px",
              minWidth: "fit-content",
              padding: 0,
            }}
            onClick={handleOpenPopup}
          >
            <DeleteRoundedIcon />
          </Button>
          <DeletePopUp open={isPopupOpen} handleClose={handleClosePopup} id={id} />
        </>
      )}
    </Stack>
  );
}
