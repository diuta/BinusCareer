export interface IFormValues {
  roleId: string;
  Permissions: string[];
}

export type PermissionsTable = {
  roleId: string;
  roleName: string;
  rolePermissions: PermissionInterface[];
};

export interface PermissionInterface {
  permissionId: string;
  permissionName: string;
}
