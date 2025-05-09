import { string } from "prop-types";

export type ProfileSlice = {
    userProfile?: ProfileUser;
    activeRole?: OrganizationRole;
    privileges: string[];
  };
  
  export type ProfileUser = {
    userId: string;
    binusianId: string;
    fullName: string;
    position: string;
    email: string;
    currentRole: string;
    currentRoleDetailId: string;
    rolePermissions: RolePermission[];
    organizationRoles?: OrganizationRole[];
  };
  export type ProfileUserFetchResponse = {
    data: ProfileUser;
  };
  
  export type OrganizationRole = {
    roleId: number;
    roleName: string;
    roleDesc: string;
  };
  
  export type RolePermission = {
    permissionId: number;
    permissionName: string;
  };

  export type SubApplication = {
    isDefault: boolean;
    appName: string;
    appType: string;
    appId: string;
    webURL: string;
    iosURL: string;
    androidURL: string;
    appStoreId: string;
    appStoreName: string;
    appStoreLocale: string;
    playStoreId: string;
    iconUrl: string;
    isWebView: boolean;
    hideInListApp: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdDateUTC: string;
    lastUpdatedDateUtc: string;
    id: string;
    documentType: string;
    documentNamespace: string;
    partitionKey: string;
    createdDate: string;
    createdBy: string | null;
    lastUpdatedDate: string;
    lastUpdatedBy: boolean | null;
    activeFlag: boolean | null;
    _etag: string;
  };
  