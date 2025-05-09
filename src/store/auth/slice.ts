import { createSlice } from "@reduxjs/toolkit";

import { AuthSlice } from "./types";

const initialState: AuthSlice = {
  user: undefined,
  userAzureAD: undefined,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state, action) => ({
      user: action.payload,
    }),
    setAuthAzureAD: (state, action) => ({
      userAzureAD: action.payload,
    }),
    logout: (state) => {
      window.localStorage.clear();
      localStorage.clear();
      // eslint-disable-next-line no-param-reassign
      return initialState;
    },
  },
});

export const { setAuth, setAuthAzureAD, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
