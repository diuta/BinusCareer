export interface FindAlumniDataForm {
  campus: string[];
  faculty: string[];
  program: string[];
  degree: string[];
  entryYear: number[];
  graduationYear: number[];
  graduationPeriod: string[];
  startUpdate: Date | null;
  endUpdate: Date | null;
  name: string;
  nim: string;
  binusianId: string;
  placeOfBirth: string;
  dateOfBirth: Date | null;
  isSOC: boolean;
  isRegisteredAlumni: boolean;
  companyName: string;
  companyCategory: string[];
  sector: string[];
  position: string;
  positionLevel: string[];
  jobCategory: string[];
  country: string[];
  province: string[];
  city: string[];
  minAge: number;
  maxAge: number;
}

export type CFPDataType = {
  campusId: number;
  campusName: string;
  facultyId: number;
  facultyName: string;
  programId: number;
  programName: string;
};

export interface AlumniDetail {
  personalData: AlumniDetailPersonalData;
  jobData: AlumniDetailJobData;
  domicileData: AlumniDetailDomicileData;
  childData: AlumniDetailChildData[];
  engagementData: AlumniDetailEngagementData[];
  endowmentData: AlumniDetailEndowmentData[];
}

export interface AlumniDetailPersonalData {
  alumniId: number;
  binusianId: string;
  nim: string;
  name: string;
  campus: string;
  faculty: string;
  program: string;
  degree: string;
  collegeProgram: string;
  minorProgram: string;
  placeOfBirth: string;
  dateOfBirth: string;
  religion: string;
  gender: string;
  nationality: string;
  binusSquare: string;
  graduationPeriod: string;
  entryYear: string;
  entryDate: string;
  graduationYear: string;
  graduationDate: string;
  studentTrack: string;
  updateYear: string;
}

export interface AlumniDetailJobData {
  companyName: string;
  companyCategory: string;
  sector: string;
  jobCategory: string;
  position: string;
  positionLevel: string;
}

export interface AlumniDetailDomicileData {
  country: string;
  province: string;
  city: string;
}

export interface AlumniDetailChildData {
  childName: string;
  dateOfBirth: string;
  gender: string;
  age: number;
  country: string;
}

export interface AlumniDetailEngagementData {
  period: string;
  activity: string;
  nominal: number;
}

export interface AlumniDetailEndowmentData {
  period: string;
  activity: string;
  debit: number;
  kredit: number;
}

export interface FindAlumniDataColumn {
  nim: string;
  name: string;
  campus: string;
  faculty: string;
  program: string;
  entryYear: string;
  graduationYear: string;
  graduationPeriod: string;
  companyName: string;
  sector: string;
  position: string;
  positionLevel: string;
  country: string;
  province: string;
  city: string;
  updateDate: string;
  collegeProgram: string;
  religion: string;
  binusSquare: string;
  graduationDate: string;
  updateYear: string;
  entryDate: string;
  nationality: string;
  binusianId: string;
  minorProgram: string;
  studentTrack: string;
  engagementCount: number;
  totalEngagement: number;
  endowmentCount: number;
  totalEndowment: number;
  gender: string;
  degree: string;
  jobCategory: string;
  companyCategory: string;
  totalChild: number;
}

export interface Dropdown {
  value: string;
  label: string;
}

export const SampleDropdown = [
  {
    value: "1",
    label: "Active",
  },
  {
    value: "2",
    label: "Not Active",
  },
];

export const ChildAgeRangeDropdown = [
  {
    minAge: 0,
    maxAge: 6,
    label: "0 - 6",
  },
  {
    minAge: 7,
    maxAge: 13,
    label: "7 - 13",
  },
  {
    minAge: 14,
    maxAge: 16,
    label: "14 - 16",
  },
  {
    minAge: 17,
    maxAge: 19,
    label: "17 - 19",
  },
  {
    minAge: 20,
    maxAge: 1000,
    label: "20+",
  },
];
