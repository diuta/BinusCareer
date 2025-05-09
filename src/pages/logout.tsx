import Container from "@mui/material/Container";
import { Box, CircularProgress, Typography } from "@mui/material";
// import { WidgetList } from 'components/widget/widget-list';
// import { WidgetToolbar } from 'components/widget/widget-toolbar';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile, logoutProfile } from "../store/profile/slice";
import { logoutAuthToken } from "../store/authToken/slice";
import { logout } from "../store/auth/slice";
import { selectProfile } from "../store/profile/selector";
import {
  selectAuthToken,
  selectAuthTokenAzureAD,
  selectAuthTokenRefresh,
} from "../store/authToken/selector";
import { useNavigate } from "react-router-dom";
import { clearError } from "../store/error/slice";
import { useRevokeRefreshToken } from "../api/identity";
import apiClient from "../config/api-client";
import { ApiService } from "../constants/ApiService";

export function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutError, setLogoutError] = useState("");

  const profile = useSelector(selectProfile);
  const azureAd = useSelector(selectAuthTokenAzureAD);
  const authToken = useSelector(selectAuthToken);
  const refreshToken = useSelector(selectAuthTokenRefresh);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const revokeToken = useRevokeRefreshToken({
    onSuccess: () => {
      performLogout();
    },
    onError: (error) => {
      console.error("Error revoking token:", error);
      // Even if token revocation fails, proceed with logout
      performLogout();
    },
  });

  const performLogout = () => {
    dispatch(logoutProfile());
    dispatch(logoutAuthToken());
    dispatch(logout());
    dispatch(clearError());
    setIsLoggingOut(false);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // If we have a JWT token, attempt to revoke the refresh token
        if (authToken.myDashboardToken) {
          // The backend will use the HTTP-only cookie to find the refresh token
          await apiClient.post(ApiService.revokeToken);
        }
        performLogout();
      } catch (error) {
        console.error("Error during logout:", error);
        setLogoutError("Failed to properly logout. Redirecting to login...");
        performLogout();
      }
    };

    handleLogout();
  }, []);

  if (!profile && !azureAd) {
    navigate("/login");
  }

  return (
    <Container maxWidth={false} disableGutters>
      {/* <WidgetToolbar
        isEditor={false}
        isOnEditMode={isOnEditMode}
        setIsOnEditMode={setIsOnEditMode}
      />
      <WidgetList isOnEditMode={isOnEditMode} /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: 3,
        }}
      >
        {isLoggingOut ? (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5">Logging out...</Typography>
            {logoutError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {logoutError}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              You have been successfully logged out.
            </Typography>
            <Typography variant="body1">
              Redirecting to login page...
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
}
