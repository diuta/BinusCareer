export interface IFormValues {
  userId: string;
  name: string;
  email: string;
  binusianId: string;
  position: string;
  mappingCampusProgramId: string[];
  roleId: number;
  status: number;
  existingRoles: number[];
  userRoleProgramId: string[];
  trUserRoleId: number;
  userIn: string;
}

export interface IDropdown {
  value: string;
  label: string;
}

export const StatusDropdown = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 2,
    label: "Not Active",
  },
];

export interface IProgramTable {
  mappingProgamId: string;
  campusId: number;
  campusName: string;
  facultyId: number;
  facultyName: string;
  programId: number;
  programName: string;
}
