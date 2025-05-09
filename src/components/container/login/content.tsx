/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/consistent-function-scoping */
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Divider from "@mui/material/Divider/Divider";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography/Typography";
import { useGetBearerToken } from "../../../api/identity";
import { ModalAlert } from "../../common/modal-alert";
import useModal from "../../../hooks/use-modal";
import jwtDecode from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthUserAzureAD } from "../../../store/auth/selector";
import { setAuthAzureAD } from "../../../store/auth/slice";
import {
  setAuthToken,
  setAuthTokenAzureAD,
} from "../../../store/authToken/slice";
import { setActiveRole, setProfile } from "../../../store/profile/slice";
import { loginStyle } from "../../../styles/container/login";
import { ModalLoginProps } from "../../../types/modal-login";
import { parseDataAzureAD, redirectToAzureAd } from "../../../utils/azure-ad";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import { ProfileUser } from "../../../store/profile/types";

export function LoginContent({ modalLogin, setModalLogin }: ModalLoginProps) {
  const [modalFailed, setModalFailed] = useState(false);
  const Navigate = useNavigate();
  const userAzureAD = useSelector(selectAuthUserAzureAD);
  const initialLoad = useRef(true);

  const handleLogin = () => {
    redirectToAzureAd({
      prompt: "select_account",
      state: { continue: "" },
    });
  };

  const dispatch = useDispatch();

  const { showModal } = useModal();

  const getBearerToken = useGetBearerToken({
    onSuccess: async (res) => {
      dispatch(setAuthToken(res.data));
      const decodedToken = jwtDecode<ProfileUser>(res.data);

      if (typeof decodedToken.organizationRoles === "string") {
        decodedToken.organizationRoles = JSON.parse(
          decodedToken.organizationRoles
        );
      }

      const userData: ProfileUser = {
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

      if (userData.userId == "") {
        showModal({
          title: "Login Failed",
          message: "User account or active role not found",
          options: {
            variant: "failed",
          },
        });
        return;
      }

      if (Array.isArray(decodedToken.organizationRoles)) {
        userData.organizationRoles = decodedToken.organizationRoles.map(
          (role: any) => ({
            roleId: role.roleId,
            roleName: role.roleName,
            roleDesc: role.roleDesc,
          })
        );
      }
      const permissions = await apiClient.get(ApiService.getCurrentPermissions);
      userData.rolePermissions = permissions.data;

      dispatch(setProfile(userData));
      if (userData.organizationRoles) {
        dispatch(setActiveRole(userData.organizationRoles[0]));
      }

      Navigate("/");
    },
    onError: (error) => {
      showModal({
        title: "Login Failed",
        message: "Failed to get Authentication Token",
        options: {
          variant: "failed",
        },
      });
    },
  });

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;

      if (window.location.hash) {
        const adState = parseDataAzureAD(window.location.hash);

        if (adState._success) {
          dispatch(setAuthTokenAzureAD(adState.access_token));
          dispatch(setAuthAzureAD(jwtDecode(adState.access_token as string)));
          getBearerToken.mutate(adState.access_token);
        }
      }
    }
  }, [dispatch, getBearerToken, userAzureAD?.unique_name]);

  return (
    <Stack component="section" sx={loginStyle.contentStack}>
      <Box sx={loginStyle.contentStackBox}>
        <Typography sx={loginStyle.contentStackBoxTypography1}>
          Welcome to Alumni Dashboard
        </Typography>
        <Typography
          variant="caption"
          sx={loginStyle.contentStackBoxTypography2}
        >
          Discover and Unlock Alumni Information and Opportunities with ADA
        </Typography>
        <Divider sx={loginStyle.contentStackBoxDivider} />
        <Stack direction="column" gap="10px">
          <LoadingButton
            variant="contained"
            color="info"
            loadingIndicator={
              <CircularProgress sx={{ color: "#5E5E5E" }} size="20px" />
            }
            sx={loginStyle.contentStackBoxLoginButton}
            onClick={handleLogin}
          >
            <Box component="img" src="/assets/logo/microsoft.png" />
            <Typography fontFamily="Segoe UI" fontSize={15} fontWeight={600}>
              Sign in with Microsoft
            </Typography>
          </LoadingButton>
          {/* <Button
            sx={loginStyle.contentStackBoxRegisterButton}
            onClick={() => Navigate('/register')}
            disabled={signByAzureAD.isLoading}
          >
            GET YOUR USERNAME
          </Button> */}
        </Stack>
        <Typography sx={loginStyle.contentStackBoxTypography3}>
          For More Information, please contact: asutomo@binus.edu,
          alumni@binus.edu
        </Typography>
        <Typography sx={loginStyle.contentStackBoxTypography4}>
          ext. 1234, 1235
        </Typography>
      </Box>
      <Box
        component="img"
        src="/assets/image/ilustrasi-login.png"
        sx={loginStyle.contentStackBoxImg}
      />

      <ModalAlert
        variant="failed"
        title="Login"
        message="User account not found, please contact administrator https://binus.ac.id/binusmaya-support"
        buttonTitle="back to login page"
        open={modalFailed}
        onOk={() => setModalFailed(false)}
        onClose={() => setModalFailed(false)}
      />
    </Stack>
  );
}
