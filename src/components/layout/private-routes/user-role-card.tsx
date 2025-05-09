import CheckIcon from "@mui/icons-material/Check";
import Face from "@mui/icons-material/Face";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { OrganizationRole } from "../../../store/profile/types";
import { homeStyle } from "../../../styles/container/home";

export function UserRoleCardActive({ role }: { role: OrganizationRole }) {
  return (
    <Box sx={homeStyle.userRoleCardActive}>
      <Box sx={homeStyle.cardBox1}>
        <Face sx={{ fontSize: "16px", color: "white" }} />
        <CheckIcon sx={{ fontSize: "16px", color: "white" }} />
      </Box>

      <Box sx={homeStyle.cardBox2}>
        <Typography component="span" sx={homeStyle.cardBoxTypography3}>
          {role.roleName}
        </Typography>
        <Stack direction="column">
          <Typography component="span" sx={homeStyle.cardBoxTypography2}>
            {role.roleDesc}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

type Props = {
  role: OrganizationRole;
  isActive?: boolean;
};

export function UserRoleCard({ role, isActive = false }: Props) {
  const activeClass = isActive ? homeStyle.userRoleCardActive : "";

  return (
    <Box sx={{ ...homeStyle.userRoleCard, ...activeClass }}>
      <Box sx={homeStyle.cardBox1}>
        <Face
          sx={{ fontSize: "16px", color: isActive ? "white" : undefined }}
        />
        {isActive && <CheckIcon sx={{ fontSize: "16px", color: "white" }} />}
      </Box>

      <Box sx={homeStyle.userRoleCardBox}>
        <Typography component="span" sx={homeStyle.cardBoxTypography3}>
          {role.roleName}
        </Typography>
        <Stack direction="column">
          <Typography component="span" sx={homeStyle.cardBoxTypography2}>
            {role.roleName === "Student" ? role.roleDesc : ""}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
