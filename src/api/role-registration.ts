import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../config/api-client';
import { ApiProfile } from '../constants/ApiProfile';
import { FormRoleFields } from '../pages/manage-roles/types';
import { Query } from '../types/api';
import { UseMutationOptions, UseQueryOptions } from '../types/react-query';

export const useCreateRoleRegistration = (options?: UseMutationOptions<string>) =>
  useMutation(
    (data: FormRoleFields) =>
      apiClient.post<string>(`${ApiProfile.createRoleRegistration}`, data).then((res) => res.data),
    options,
  );

export const useUpdateRoleRegistration = (options?: UseMutationOptions<string>) =>
  useMutation(
    (data: FormRoleFields) =>
      apiClient
        .post<string>(`${ApiProfile.updateRoleRegistration(data.id)}`, data)
        .then((res) => res.data),
    options,
  );

export const useDeleteRoleRegistration = (options?: UseMutationOptions) =>
  useMutation(
    (id: string) =>
      apiClient
        .delete<unknown, { data: string }>(`${ApiProfile.deleteRoleByID(id)}`)
        .then((res) => res.data),
    options,
  );

export const useQueryListRoles = ({
  query,
  options,
}: {
  query?: Query;
  options?: UseQueryOptions<{ result: FormRoleFields[]; totalCount: number }>;
}) =>
  useQuery(
    [`listRoles`, query],
    () =>
      apiClient
        .get<unknown, { data: { result: FormRoleFields[]; totalCount: number } }>(
          ApiProfile.getListRoles,
          { params: query },
        )
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );

export const useQueryRoleByID = (id: string, options?: UseQueryOptions<FormRoleFields>) =>
  useQuery(
    [`roles-${id}`],
    () =>
      apiClient
        .get<unknown, { data: FormRoleFields }>(ApiProfile.getRolesByID(id))
        .then((res) => res.data),
    options,
  );

export const useQueryUpdateDefaultRole = ({
  query,
  options,
}: {
  query: { orgRoleId: string };
  options?: UseQueryOptions<FormRoleFields>;
}) =>
  useQuery(
    ['update-default-role', query],
    () =>
      apiClient
        .get<FormRoleFields>(ApiProfile.updateDefaultRoleById(query.orgRoleId))
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );
