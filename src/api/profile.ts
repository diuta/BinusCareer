import { useMutation } from '@tanstack/react-query';
import apiClient from '../config/api-client';
import { ApiProfile } from '../constants/ApiProfile';
import { ProfileUser } from '../store/profile/types';
import { UseMutationOptions } from '../types/react-query';
import { ApiService } from '../constants/ApiService';

// ========================================
// QUERIES
// ========================================
export const useMutationProfile = (options?: UseMutationOptions<ProfileUser>) =>
  useMutation(
    ['profile'],
    (email) =>
      apiClient
        .post<unknown, { data: ProfileUser }>(ApiProfile.person, {
          email, // email
        })
        .then((res) => res.data),
    options,
  );

  export const useGetUserProfile = (options: UseMutationOptions<ProfileUser>) => {
    useMutation(
      (token) => apiClient.get(ApiService.getProfile, { params: { azureADToken: token } }).then((res) => res.data),
      options,
    );
  }
    
// export const useQueryProfile = (options?: UseQueryOptions<ProfileUser>) =>
//   useQuery<unknown, AxiosError, ProfileUser, string[]>(
//     ['profile'],
//     () =>
//       new Promise<ProfileUser>((resolve) => {
//         setTimeout(() => {
//           resolve(ProfileExample);
//         }, 5000);
//       }),
//     options,
//   );
