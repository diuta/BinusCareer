import {
  Backdrop,
  Divider,
  Stack,
  useMediaQuery,
  Typography,
  Modal,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { selectProfile } from "../../../store/profile/selector";
import { layoutPrivateStyle } from "../../../styles/layout/private-routes";

import { Header } from "./header";
import { SideMenuAdmin } from "./sidemenu-admin";

import PageWrapper from "../../container/PageWrapper";
import useModal from "../../../hooks/use-modal";
import { selectError } from "../../../store/error/selector";
import { clearError } from "../../../store/error/slice";

import { ModalAlert } from "../../common/modal-alert";

export function LayoutPrivateRoute({
  children,
  title,
  requiredPermission,
}: {
  children: JSX.Element | JSX.Element[];
  title: string;
  requiredPermission: string;
}) {
  const profile = useSelector(selectProfile);
  const globalError = useSelector(selectError);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adminMenu, setAdminMenu] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const smallScreen = useMediaQuery("(min-width: 600px)");

  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("/dashboard/editor");

  const { showModal } = useModal();

  useEffect(() => {
    if (globalError.title != "") {
      showModal({
        title: globalError.title,
        message: globalError.message,
        options: {
          variant: globalError.type,
          onOk: () => {
            if (
              globalError.title === "Login Timeout" ||
              globalError.title === "Token Expired"
            ) {
              navigate("/logout");
            }
            dispatch(clearError());
          },
        },
      });
    }
  }, [globalError]);

  useEffect(() => {
    if (smallScreen) {
      setIsSmall(true);
    } else {
      setIsSmall(false);
    }
  }, [smallScreen]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // check if user has successfully login
  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ini check punya permission buat akses suatu route apa ga
  const userPermissions = profile.rolePermissions.map(
    (permission) => permission.permissionName
  );

  const toggleSideMenu = () => {
    setIsSmall((prev) => !prev);
  };

  return (
    <Box component="main" sx={layoutPrivateStyle.privateRoutes}>
      <Header toggleSideMenu={toggleSideMenu} />
      <Stack
        direction="row"
        sx={{ ...layoutPrivateStyle.privateRoutesSideMenu }}
      >
        <SideMenuAdmin
          adminMenu={adminMenu}
          setAdminMenu={setAdminMenu}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isSmall={isSmall}
        />
        <Box
          component="div"
          width={!isSmall ? "100%" : "calc(100vw - 240px)"}
          overflow="auto"
        >
          <>
            {title.length > 0 && (
              <PageWrapper>
                <Box component="div">
                  <Typography variant="h5" display="inline">
                    {title}
                  </Typography>

                  <Box id="header-portal-content" component="span" />
                </Box>
              </PageWrapper>
            )}
            <Divider />
            {children}
          </>
        </Box>
      </Stack>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: 1,
          height: "100vh",
          width: "100vw",
        }}
        open={isSmall && !smallScreen}
        onClick={toggleSideMenu}
      />
    </Box>
  );
}

export default LayoutPrivateRoute;
