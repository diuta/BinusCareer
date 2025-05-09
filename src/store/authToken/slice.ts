import { createSlice } from '@reduxjs/toolkit';

import { AuthTokenState } from './types';

const initialState: AuthTokenState = {
  myDashboardToken: '',
  azureADToken: '',
  refreshToken: '',
};

export const authTokenSlice = createSlice({
  name: 'authTokenSlice',
  initialState,
  reducers: {
    setAuthToken: (state, action) => ({
      myDashboardToken: action.payload,
      refreshToken: state.refreshToken,
      azureADToken: state.azureADToken,
    }),
    setRefreshToken: (state, action) => ({
      myDashboardToken: state.myDashboardToken,
      refreshToken: action.payload,
      azureADToken: state.azureADToken,
    }),
    setAuthTokenAzureAD: (state, action) => ({
      myDashboardToken: state.myDashboardToken,
      refreshToken: state.refreshToken,
      azureADToken: action.payload,
    }),
    logoutAuthToken: (state) => {
      window.localStorage.clear();
      localStorage.clear();
      return initialState;
    },
  },
});

export const { setAuthToken, setRefreshToken, setAuthTokenAzureAD, logoutAuthToken } = authTokenSlice.actions;
export const authTokenReducer = authTokenSlice.reducer;
