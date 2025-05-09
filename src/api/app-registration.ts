import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../config/api-client';
import { ApiProfile } from '../constants/ApiProfile';
import { AppRegistrationList, FormAppFields } from '../pages/manage-apps/types';
import { Query } from '../types/api';
import { UseMutationOptions, UseQueryOptions } from '../types/react-query';

export const useCreateAppRegistration = (options?: UseMutationOptions) =>
  useMutation(
    (data: FormAppFields) =>
      apiClient
        .post<unknown, { data: string }>(`${ApiProfile.createAppRegistration}`, data)
        .then((res) => res.data),
    options,
  );

export const useUpdateAppRegistration = (options?: UseMutationOptions) =>
  useMutation(
    (data: FormAppFields) =>
      apiClient
        .put<unknown, { data: string }>(`${ApiProfile.updateAppRegistration}`, data)
        .then((res) => res.data),
    options,
  );

export const useDeleteAppRegistration = (options?: UseMutationOptions) =>
  useMutation(
    (id: string) =>
      apiClient
        .delete<unknown, { data: string }>(`${ApiProfile.deleteAppByID(id)}`)
        .then((res) => res.data),
    options,
  );

export const useQueryListApps = ({
  query,
  options,
}: {
  query?: Query;
  options?: UseQueryOptions<{ result: AppRegistrationList[]; totalCount: number }>;
}) =>
  useQuery(
    [`listApps`, query],
    () =>
      apiClient
        .get<unknown, { data: { result: AppRegistrationList[]; totalCount: number } }>(
          ApiProfile.getListApps,
          { params: query },
        )
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );

export const useQueryListAppsByPerson = ({
  query,
  options,
}: {
  query?: Query;
  options?: UseQueryOptions<{ result: AppRegistrationList[]; totalCount: number }>;
}) =>
  useQuery(
    [`listApps`, query],
    () =>
      apiClient
        .get<unknown, { data: { result: AppRegistrationList[]; totalCount: number } }>(
          ApiProfile.getListAppsByPerson,
          { params: query },
        )
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );

export const useQueryAppByID = (id: string, options?: UseQueryOptions<AppRegistrationList>) =>
  useQuery(
    [`app-${id}`],
    () =>
      apiClient
        .get<unknown, { data: AppRegistrationList }>(ApiProfile.getAppByID(id))
        .then((res) => res.data),
    options,
  );
