/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
import { Box, CircularProgress } from "@mui/material";
import { useRefreshAccessToken } from "../../api/identity";
import { useAuth } from "../../hooks/use-auth";
import useModal from "../../hooks/use-modal";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectAuth } from "../../store/auth/selector";
import {
  selectAuthToken,
  selectAuthTokenAzureAD,
  selectAuthTokenRefresh,
} from "../../store/authToken/selector";
import { setAuthToken, setRefreshToken } from "../../store/authToken/slice";
import {
  selectProfile,
  selectProfileActiveRole,
} from "../../store/profile/selector";
import jwtDecode from "jwt-decode";
import apiClient from "../../config/api-client";
import { ApiService } from "../../constants/ApiService";

interface DecodedToken {
  exp: number;
}

export function AuthProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const refreshAccessToken = useRefreshAccessToken();

  const location = useLocation();
  const azureADToken = useSelector(selectAuthTokenAzureAD);
  const authToken = useSelector(selectAuthToken);
  const refreshToken = useSelector(selectAuthTokenRefresh);
  const profile = useSelector(selectProfile);
  const activeRole = useSelector(selectProfileActiveRole);
  const { isExpiredInOneMinute, isRefreshExpired } = useAuth();

  const dispatch = useDispatch();

  const refreshTokenExp = async () => {
    try {
      // The backend will automatically retrieve the refresh token from HTTP-only cookie
      const response = await apiClient.post(ApiService.refreshToken);

      if (response.data && response.data.jwtToken) {
        dispatch(setAuthToken(response.data.jwtToken));
        return true;
      }
      console.error("Failed to refresh token: Invalid response format");
      window.location.href = "/logout";
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      window.location.href = "/logout";
      return false;
    }
  };

  useEffect(() => {
    // Initialize timeout ID without explicitly assigning undefined
    let timeoutId: NodeJS.Timeout;

    // Check if JWT token is about to expire
    if (authToken.myDashboardToken && authToken.myDashboardToken !== "") {
      try {
        const decodedToken = jwtDecode<DecodedToken>(
          authToken.myDashboardToken
        );
        const currentTime = Date.now() / 1000;

        // Calculate time until token expires (in milliseconds)
        const remainingTime = (decodedToken.exp - currentTime) * 1000;

        // Set a timeout to show a warning before the token expires
        timeoutId = setTimeout(() => {
          // If token is significantly expired, just log out
          if (remainingTime < -60_000) {
            // 1 minute grace period
            window.location.href = "/logout";
            return;
          }

          // Show popup for 5 minutes
          const popupDuration = 5 * 60 * 1000;
          const popupStartTime = Date.now();

          let countdownInterval: NodeJS.Timeout;
          let logoutTimeout: NodeJS.Timeout;

          const updateCountdownMessage = () => {
            const timeElapsedSincePopup = Date.now() - popupStartTime;
            const timeRemaining = popupDuration - timeElapsedSincePopup;

            if (timeRemaining <= 0) {
              clearInterval(countdownInterval);
              window.location.href = "/logout";
              return;
            }

            const minutes = Math.floor(timeRemaining / 1000 / 60);
            const seconds = Math.floor((timeRemaining / 1000) % 60);

            showModal({
              title: "Session Expiring",
              message: `Your session is about to expire. You will be logged out in ${minutes} minute(s) and ${seconds} second(s).`,
              options: {
                buttonTitle: "Extend Session",
                variant: "info",
                onOk: () => {
                  refreshTokenExp();
                  clearTimeout(logoutTimeout);
                  clearInterval(countdownInterval);
                },
              },
            });
          };

          updateCountdownMessage();
          countdownInterval = setInterval(updateCountdownMessage, 1000);

          logoutTimeout = setTimeout(() => {
            clearInterval(countdownInterval);
            window.location.href = "/logout";
          }, popupDuration);
        }, Math.max(0, remainingTime - 60_000)); // Show popup 1 minute before expiration
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }

    // Always return a cleanup function, even if no timeoutId was set
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [authToken.myDashboardToken]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (isExpiredInOneMinute && !isRefreshExpired) {
      refreshTokenExp();
    }

    // No need to return an empty cleanup function
    // JavaScript automatically returns undefined from functions with no return statement
  }, [isExpiredInOneMinute, isRefreshExpired]);

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
