/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/prefer-node-protocol */
import { useMutation } from "@tanstack/react-query";
import apiClient from "../config/api-client";
import { ApiIdentity } from "../constants/ApiIdentity";
import {
  IdentityLogin,
  IdentityLoginAzureAD,
  IdentityLoginResponse,
  BearerToken,
  AuthenticateRequest,
  AuthenticateResponse,
  RevokeTokenRequest,
} from "../types/identity";
import { UseMutationOptions } from "../types/react-query";
import { ApiService } from "../constants/ApiService";

// ========================================
// MUTATIONS
// ========================================
export const useSignInByEmail = (
  options?: UseMutationOptions<IdentityLoginResponse>
) =>
  useMutation(
    (data: IdentityLogin) =>
      apiClient
        .post<IdentityLoginResponse>(`${ApiIdentity.signInByEmailV2}`, data)
        .then((res) => res.data),
    options
  );

export const useSignInByAzureAD = (
  options?: UseMutationOptions<IdentityLoginResponse>
) =>
  useMutation(
    (data: IdentityLoginAzureAD) =>
      apiClient
        .post<IdentityLoginResponse>(`${ApiIdentity.signInByAzureAdV2}`, data)
        .then((res) => res.data),
    options
  );

export const useAuthenticate = (
  options?: UseMutationOptions<AuthenticateResponse>
) =>
  useMutation(
    (data: AuthenticateRequest) =>
      apiClient
        .post<AuthenticateResponse>(ApiService.login, data)
        .then((res) => res.data),
    options
  );

export const useRevokeRefreshToken = (options?: UseMutationOptions) =>
  useMutation(
    (data: RevokeTokenRequest) =>
      apiClient
        .post(ApiIdentity.revokeRefreshToken, data)
        .then((res) => res.data),
    options
  );

export const useRefreshAccessToken = (
  options?: UseMutationOptions<AuthenticateResponse>
) =>
  useMutation(
    () =>
      apiClient.post(ApiIdentity.refreshAccessToken).then((res) => res.data),
    options
  );

export const useGetBearerToken = (options: UseMutationOptions<BearerToken>) =>
  useMutation(
    (token) =>
      apiClient
        .post(ApiService.auth, { azureADToken: token })
        .then((res) => res),
    options
  );

// export const useSignInByEmail = (options?: UseMutationOptions) =>
//   useMutation(
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     (data: IdentityLogin) =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(
//             'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImFhYjExMjJkLWQ3NGEtNDBhYi05NTVkLTc2MDRmMDE3Y2FkMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJTSUxWSUEgV0lCT1dPIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiR3Vlc3QiLCJuYmYiOjE2NzU0MTg2NTYsImV4cCI6MTY3NjAyMzQ1NiwiaXNzIjoiQmludXNTZXJ2aWNlcyIsImF1ZCI6Ik5leHVzLklkZW50aXR5U2VydmljZSJ9.iiHKORecLOZrTlVNq8yrQHYy4CJM2VEjC1nmClzZSsnB2lF71A31mBoKdGaB3FwPPRrAK-CFkQhRnki3BOupNSJhna4KeC-DhxUJg0vb5j5jCBxp2tW1ByJmymPhFXbxrhS2MKJKeP0O7ZjvQP9IiiwnvCjx5mzqZm6O5fr_XpY',
//           );
//         }, 2000);
//       }),
//     options,
//   );
