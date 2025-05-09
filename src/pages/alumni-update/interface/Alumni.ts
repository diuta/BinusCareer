import { Child, ChildUpdatePayload } from './Child';

export interface Alumni {
  alumniId: number;
  alumniNIM: string;
  alumniCode: string;
  alumniName: string;
  alive: boolean;
  child: Child[];
  email: AlumniContact[];
  phone: AlumniContact[];
  companyCategoryId: string;
  countryId: string;
  cityId: string;
  jobCategoryId: string;
  provinceId: string;
  positionLevelId: string;
  sectorId: string;
  sectorName: string;
  companyCategoryName: string;
  jobCategoryName: string;
  campusName: string;
  cityName: string;
  degreeName: string;
  facultyName: string;
  programName: string;
  companyName: string;
  positionName: string;
  positionLevelName: string;
  countryName: string;
  provinceName: string;
  placeOfBirth: string;
  graduationYear: string | null;
  entryYear: string;
  graduationDate: string | null;
  entryDate: string | null;
  dateOfBirth: string | null;
  lastStatus: string;
  isUpdated: boolean;
  evidence: string;
  dateUp: string;
  userUp: string;
}

export interface AlumniContact {
  id: string;
  data: string;
  previousData: string;
  isPrimary: boolean;
  generatedBySystem: boolean;
  shown: boolean;
}

export interface AlumniContactImport {
  id: string;
  data: string;
}

export type AlumniUpdatePayload = Pick<
  Alumni,
  | 'alumniId'
  | 'alumniNIM'
  | 'alumniCode'
  | 'alumniName'
  | 'campusName'
  | 'facultyName'
  | 'programName'
  | 'degreeName'
  | 'placeOfBirth'
  | 'dateOfBirth'
  | 'entryDate'
  | 'graduationYear'
  | 'companyName'
  | 'positionName'
  | 'positionLevelId'
  | 'positionLevelName'
  | 'alive'
  | 'companyCategoryId'
  | 'sectorId'
  | 'jobCategoryId'
  | 'countryId'
  | 'provinceId'
  | 'cityId'
  | 'dateUp'
  | 'isUpdated'
  | 'evidence'
>;

export type UpdateAlumniPassedAway = Pick<Alumni, 'alive'> & {
  evidence: File | string | null;
  evidenceType: 'file' | 'url';
};

export type UpdateAlumniAlive = Pick<
  Alumni,
  | 'alive'
  | 'companyName'
  | 'companyCategoryId'
  | 'sectorId'
  | 'positionName'
  | 'positionLevelId'
  | 'jobCategoryId'
  | 'countryId'
  | 'provinceId'
  | 'cityId'
  | 'email'
  | 'phone'
> & {
  child: ChildUpdatePayload[];
};

export type UpdateAlumniPassedAwayImport = Pick<
  Alumni,
  | 'alive'
  | 'alumniNIM'
  | 'alumniName'
  | 'facultyName'
  | 'campusName'
  | 'programName'
  | 'degreeName'
> & {
  evidence: string;
};

export type UpdateAlumniAliveImport = Pick<
  Alumni,
  | 'alive'
  | 'alumniNIM'
  | 'alumniName'
  | 'facultyName'
  | 'campusName'
  | 'programName'
  | 'degreeName'
  | 'companyName'
  | 'companyCategoryId'
  | 'sectorId'
  | 'positionName'
  | 'positionLevelId'
  | 'jobCategoryId'
  | 'countryId'
  | 'provinceId'
  | 'cityId'
> & {
  email: AlumniContactImport[];
  phone: AlumniContactImport[];
};

export type AlumniDetailImport = Pick<
  Alumni,
  | 'alumniNIM'
  | 'alumniName'
  | 'facultyName'
  | 'campusName'
  | 'programName'
  | 'degreeName'
>;

export interface AlumniLog {
  fieldName: string;
  previousData: string;
  updatedData: string;
  dateUp: string;
  userUp: string;
}
