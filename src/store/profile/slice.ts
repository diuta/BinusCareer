import { createSlice } from '@reduxjs/toolkit';

import { ProfileSlice } from './types';

export const initialState: ProfileSlice = {
  userProfile: undefined,
  activeRole: undefined,
  privileges: [],
};

export const profileSlice = createSlice({
  name: 'profileSlice',
  initialState,
  reducers: {
    setProfile: (state, action) => ({
      ...state,
      userProfile: action.payload,
    }),
    setActiveRole: (state, action) => ({
      ...state,
      activeRole: action.payload,
    }),
    setPrivileges: (state, action) => ({
      ...state,
      privileges: action.payload,
    }),
    logoutProfile: (state) => {
      window.localStorage.clear();
      localStorage.clear();
      return initialState;
    },
  },
});

export const { setProfile, setActiveRole, setPrivileges, logoutProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
