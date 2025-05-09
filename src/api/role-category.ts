import { useQuery } from '@tanstack/react-query';
import apiClient from '../config/api-client';
import { ApiProfile } from '../constants/ApiProfile';
import { FormMasterPrivilegeFields, RoleCategoryList } from '../pages/manage-roles/types';
import { Query } from '../types/api';
import { UseQueryOptions } from '../types/react-query';

export const useQueryListRoleCategory = ({
  query,
  options,
}: {
  query?: Query;
  options?: UseQueryOptions<RoleCategoryList[]>;
}) =>
  useQuery(
    ['listRoleCategory', query],
    () =>
      apiClient
        .get<unknown, { data: RoleCategoryList[] }>(ApiProfile.getListRoleCategory, {
          params: query,
        })
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );

export const useQueryListMasterPrivilege = ({
  query,
  options,
}: {
  query?: Query;
  options?: UseQueryOptions<FormMasterPrivilegeFields[]>;
}) =>
  useQuery(
    ['listMasterPrivilege', query],
    () =>
      apiClient
        .get<unknown, { data: FormMasterPrivilegeFields[] }>(ApiProfile.getListMasterPrivilege, {
          params: query,
        })
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );

export const useQueryMasterPrivilegeAllByID = (
  id: string,
  options?: UseQueryOptions<FormMasterPrivilegeFields[]>,
) =>
  useQuery(
    [`privilegeAll-${id}`],
    () =>
      apiClient
        .get<unknown, { data: FormMasterPrivilegeFields[] }>(
          ApiProfile.getListMasterPrivilegeAllByID(id),
        )
        .then((res) => res.data),
    options,
  );

export const useQueryMasterPrivilegeByID = ({
  query,
  options,
}: {
  query: { id: string };
  options?: UseQueryOptions<FormMasterPrivilegeFields[]>;
}) =>
  useQuery(
    ['listMasterPrivilege', query],
    () =>
      apiClient
        .get<unknown, { data: FormMasterPrivilegeFields[] }>(
          ApiProfile.getListMasterPrivilegeByID(query.id),
        )
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );

export const useQueryListUserPrivileges = ({
  query,
  options,
}: {
  query?: Query;
  options?: UseQueryOptions<string[]>;
}) =>
  useQuery(
    ['listUserPrivilege', query],
    () =>
      apiClient
        .get<unknown, { data: string[] }>(ApiProfile.getListUserPrivileges, {
          params: query,
        })
        .then((res) => res.data),
    {
      enabled: true,
      ...options,
    },
  );
