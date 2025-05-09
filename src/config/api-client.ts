/* eslint-disable no-param-reassign */
import axios from 'axios';
import { store } from '../store';
import  Keys from '../constants/Keys';
import { setError } from '../store/error/slice';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const {
    // profile: { activeRole },
    authToken: { myDashboardToken, azureADToken },
  } = store.getState();

  config.headers = config.headers ?? {};

  if (config.url?.includes('auth/getTokenADA')) {
    config.headers.Authorization = `Basic ${btoa(Keys.DivisionID)}`;
  }
  else {
    if (myDashboardToken) {
      config.headers.Authorization = `Bearer ${myDashboardToken}`;
    }
    if (azureADToken) {
      config.headers.AzureADToken = `Bearer ${azureADToken}`;
    }
  }
  // if (activeRole?.roleId) {
  //   config.headers.roleId = activeRole?.roleId;
  //   config.headers.userRoleId = activeRole?.roleId;
  // }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) =>
  {
    if(err.response?.status === 401){
      store.dispatch(setError({title: "Login Timeout", type: "failed", message: "login details changed, please login again"}));
    }
    if(err.response?.status === 403){
      store.dispatch(setError({title: "Token Expired", type: "failed", message: "Token expired, please login again"}));
    }
    return Promise.reject(err)
  }
);

export default apiClient;
