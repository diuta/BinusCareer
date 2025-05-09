import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './auth/slice';
import { authTokenReducer } from './authToken/slice';
// import { presetsReducer } from './preset/slice';
import { profileReducer } from './profile/slice';
import { errorReducer } from './error/slice';

export default combineReducers({
  auth: authReducer,
  authToken: authTokenReducer,
//   preset: presetsReducer,
  profile: profileReducer,
  error: errorReducer,
});
