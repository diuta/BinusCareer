import { createSlice } from '@reduxjs/toolkit';

import { ErrorSlice } from './types';

const initialState: ErrorSlice = {
  title: '',
  type: 'success',
  message: '',
};

export const errorSlice = createSlice({
  name: 'errorSlice',
  initialState,
  reducers: {
    setError: (state, action) => ({
      type: action.payload.type,
      message: action.payload.message,
      title: action.payload.title,
    }),
    clearError: (state) =>
    //   window.localStorage.clear();
    //   localStorage.clear();
       initialState
    ,
  },
});

export const { setError, clearError } = errorSlice.actions;
export const errorReducer = errorSlice.reducer;
