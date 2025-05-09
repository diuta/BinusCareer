/* eslint-disable consistent-return */
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import {
  selectAuthTokenMyDashboard,
  selectAuthTokenRefresh,
} from "../store/authToken/selector";

export const useAuth = () => {
  const myDashboardToken = useSelector(selectAuthTokenMyDashboard);
  const refreshToken = useSelector(selectAuthTokenRefresh);
  const now = Math.floor(Date.now() / 1000);

  try {
    const { exp }: { exp: number } = jwtDecode(refreshToken);
    const { exp: expMyDashboard }: { exp: number } =
      jwtDecode(myDashboardToken);
    return {
      isRefreshExpired: exp < Date.now() / 1000,
      isExpiredInOneMinute: expMyDashboard - now <= 60,
    };
  } catch {
    return { isRefreshExpired: false, isExpiredInOneMinute: false };
  }
};
