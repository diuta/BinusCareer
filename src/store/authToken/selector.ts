import { RootState } from '../store';

import { AuthTokenState } from './types';

export const selectAuthToken = (state: RootState): AuthTokenState => state.authToken;
export const selectAuthTokenMyDashboard = (state: RootState): string =>
  state.authToken.myDashboardToken;
export const selectAuthTokenAzureAD = (state: RootState): string => state.authToken.azureADToken;
export const selectAuthTokenRefresh = (state: RootState): string => state.authToken.refreshToken;
