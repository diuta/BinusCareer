import { RootState } from "../store";
import {
  IdentityAuth,
  IdentityAzureADAuth,
  IdentityLoginAuth,
} from "../../types/identity";

export const selectAuth = (state: RootState): IdentityAuth => state.auth;

export const selectAuthUser = (state: RootState): IdentityLoginAuth =>
  state.auth.user;
export const selectAuthUserAzureAD = (state: RootState): IdentityAzureADAuth =>
  state.auth.userAzureAD;
