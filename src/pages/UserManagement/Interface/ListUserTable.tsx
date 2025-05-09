export type ListUserTable = {
  userId: string;
  name: string;
  email: string;
  position: string;
  trUserRoleId: string;
};

export type userDetail = {
  name: string;
  binusianId: string;
  userRoles: ListUserRoleTable[];
};

export type ListUserRoleTable = {
  no: number;
  role: string;
  status: string;
  trUserRoleId: string;
};
