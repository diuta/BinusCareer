export interface IFormValues {
  userId: string;
  name: string;
  email: string;
  binusianId: string;
  position: string;
  mappingCampusProgramId: string[];
  roleId: string;
  status: number;
  existingRoles: string[];
}

export interface Dropdown {
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
  campusId: string;
  campusName: string;
  facultyId: string;
  facultyName: string;
  programId: string;
  programName: string;
}
