import Face from "@mui/icons-material/Face";
import { Stack, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectProfileActiveRole,
  selectProfile,
} from "../../../store/profile/selector";
import { layoutPrivateStyle } from "../../../styles/layout/private-routes";
import { AdminMenuProps } from "../../../types/admin-menu";

import { OverlayChangeRole } from "../overlay";
import { ModulChangeRole } from "./modul-change-role";

import { ApiService } from "../../../constants/ApiService";
import apiClient from "../../../config/api-client";

import { OrganizationRole } from "../../../store/profile/types";

// eslint-disable-next-line sonarjs/cognitive-complexity
export function UserInfoCard({ adminMenu, modulOpen }: AdminMenuProps) {
  const [modalChangeRoles, setModalChangeRoles] = useState(false);
  const activeRole = useSelector(selectProfileActiveRole);
  const userProfile = useSelector(selectProfile);

  const isSmall = useMediaQuery("(min-width: 600px)");

  const [organizationRoles, setOrganizationRoles] = useState<
    OrganizationRole[]
  >([]);

  const getUserRole = async () => {
    const response = await apiClient.get(
      `${ApiService.user}/${userProfile?.userId}/role`
    );

    setOrganizationRoles(response.data);
  };

  const sideMenuCardModul = isSmall
    ? adminMenu
      ? { display: "none" }
      : layoutPrivateStyle.cardBox2
    : modulOpen
    ? !adminMenu
      ? layoutPrivateStyle.cardBox2
      : { display: "none" }
    : adminMenu
    ? layoutPrivateStyle.cardBox2
    : { display: "none" };

  const sideMenuCardButtonModul = isSmall
    ? adminMenu
      ? { display: "none" }
      : layoutPrivateStyle.cardButton
    : modulOpen
    ? !adminMenu
      ? layoutPrivateStyle.cardButton
      : { display: "none" }
    : adminMenu
    ? layoutPrivateStyle.cardButton
    : { display: "none" };

  const sideMenuCardTitle = isSmall
    ? adminMenu
      ? { display: "none" }
      : { fontSize: "14px" }
    : modulOpen
    ? !adminMenu
      ? { fontSize: "14px" }
      : { display: "none" }
    : adminMenu
    ? { fontSize: "14px" }
    : { display: "none" };

  return (
    <Box sx={layoutPrivateStyle.card}>
      <Box sx={layoutPrivateStyle.cardBox1}>
        <Stack
          direction="row"
          alignItems="center"
          gap="5px"
          sx={{ color: "white" }}
        >
          <Face sx={{ fontSize: "22px" }} />
          <Typography sx={sideMenuCardTitle}>Role</Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            getUserRole();
            setModalChangeRoles?.(!modalChangeRoles);
          }}
          sx={layoutPrivateStyle.cardButton}
        >
          <Typography sx={{ fontSize: "10px" }}>Change</Typography>
        </Button>
      </Box>

      <Box sx={layoutPrivateStyle.cardBox2}>
        <Typography component="span" sx={layoutPrivateStyle.cardBoxTypography1}>
          {userProfile?.fullName}
        </Typography>
        <Typography component="span" sx={layoutPrivateStyle.cardBoxTypography2}>
          {activeRole?.roleName}
        </Typography>
        <Typography component="span" sx={layoutPrivateStyle.cardBoxTypography2}>
          {userProfile?.position}
        </Typography>
      </Box>

      <OverlayChangeRole
        modalChangeRoles={modalChangeRoles}
        setModalChangeRoles={setModalChangeRoles}
        organizationRoles={organizationRoles}
      />
      <ModulChangeRole
        modalChangeRoles={modalChangeRoles}
        setModalChangeRoles={setModalChangeRoles}
        organizationRoles={organizationRoles}
      />
    </Box>
  );
}
