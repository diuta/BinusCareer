/* eslint-disable @typescript-eslint/no-unused-vars */
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography/Typography";
import { useQueryListApps } from "../../api/app-registration";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthTokenMyDashboard } from "../../store/authToken/selector";
import {
  selectProfile,
  selectProfileActiveRole,
} from "../../store/profile/selector";
import { layoutPrivateStyle } from "../../styles/layout/private-routes";
import { layoutPublicStyle } from "../../styles/layout/public-routes";
import { AppsSideMenuProps } from "../../types/apps-side-menu";
import { MobileMenuProps } from "../../types/mobile-menu";

// import { UserInfoCard } from './private-routes/user-info-card';

export function SideMenuPublicRoute({
  mobileMenu,
  setMobileMenu,
}: MobileMenuProps) {
  const containerRef = useRef(null);
  const sideMenu = (
    <Paper elevation={4}>
      <Box sx={layoutPublicStyle.sideMenuPaperBox}>
        <Box sx={layoutPublicStyle.sideMenuBoxIcon}>
          <CloseIcon
            sx={layoutPublicStyle.sideMenuIcon}
            onClick={() => setMobileMenu?.(!mobileMenu)}
          />
        </Box>
        <Box sx={layoutPublicStyle.sideMenuBoxLink}>
          <Link
            href="/login"
            underline="none"
            sx={layoutPublicStyle.sideMenuLink}
          >
            <Typography sx={layoutPublicStyle.sideMenuLinkTypography}>
              Support
            </Typography>
          </Link>
        </Box>
        <Box sx={layoutPublicStyle.sideMenuBoxLink}>
          <Link
            href="/newLogin"
            underline="none"
            sx={layoutPublicStyle.sideMenuLink}
          >
            <Typography sx={layoutPublicStyle.sideMenuLinkTypography}>
              Login
            </Typography>
          </Link>
        </Box>
        <Box sx={layoutPublicStyle.sideMenuBoxLink}>
          <Link
            href="/newRegister"
            underline="none"
            sx={layoutPublicStyle.sideMenuLink}
          >
            <Typography sx={layoutPublicStyle.sideMenuLinkTypography}>
              Register
            </Typography>
          </Link>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box ref={containerRef} sx={layoutPublicStyle.sideMenu}>
      <Slide direction="left" in={mobileMenu}>
        {sideMenu}
      </Slide>
    </Box>
  );
}

export function SideMenuPrivateRoute({
  mobileMenu,
  setMobileMenu,
  modalChangeRoles,
  setModalChangeRoles,
}: MobileMenuProps) {
  const containerRef = useRef(null);
  const myDashboardToken = useSelector(selectAuthTokenMyDashboard);
  const profile = useSelector(selectProfile);
  const activeRole = useSelector(selectProfileActiveRole);
  const { roleName } = activeRole;

  const queryListApps = useQueryListApps({
    options: {
      enabled: true,
    },
  });

  const Apps: AppsSideMenuProps =
    queryListApps.data?.result
      ?.filter((field) => field.hideInListApp === false)
      .map((app) => ({
        name: app.subAppName,
        icon: app.iconWeb,
        link: app.webURL
          .replace("{{token}}", myDashboardToken)
          .replace("{{role}}", roleName),
      })) || [];

  const Navigate = useNavigate();

  const sideMenu = (
    <Paper elevation={4}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          width: "100%",
          padding: "16px",
          borderBottom: "1px solid rgba(0,0,0, 0.1)",
        }}
      >
        <Box
          component="img"
          src="/assets/icon/semesta.svg"
          onClick={() => setMobileMenu?.(!mobileMenu)}
          sx={layoutPrivateStyle.headerIcon}
        />
        <Typography
          sx={{
            fontSize: "14px",
            color: "#028ED5",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
            display: "none",
          }}
          onClick={() => Navigate("/")}
        >
          My Dashboard
        </Typography>
      </Stack>
      <Box sx={layoutPrivateStyle.appMenuPaperBox}>
        <Box sx={layoutPrivateStyle.appMenuBoxIcon}>
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              width: "100%",
              height: "165px",
            }}
          >
            {/* <UserInfoCard
              setModalChangeRoles={setModalChangeRoles}
              modalChangeRoles={modalChangeRoles}
            /> */}
          </Box>
          <Typography sx={layoutPrivateStyle.appMenuTitle}>
            Semesta Apps
          </Typography>
        </Box>

        <Box sx={layoutPrivateStyle.appMenuBoxLink}>
          {Apps.sort((a, b) => (a.name > b.name ? 1 : -1)).map((app) => (
            <Link
              key={app.name}
              target="_blank"
              href={`${app.link}`}
              sx={layoutPrivateStyle.appMenuLink}
            >
              <Box
                component="img"
                sx={layoutPrivateStyle.appMenuLinkBoxImg}
                alt={app.name}
                src={app.icon || ""}
              />
              <Typography sx={layoutPrivateStyle.appMenuLinkTypography}>
                {app.name}
              </Typography>
            </Link>
          ))}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box ref={containerRef} sx={layoutPrivateStyle.appMenu}>
      <Slide direction="right" in={mobileMenu} key="slideRight">
        {sideMenu}
      </Slide>
    </Box>
  );
}
