export interface FilterDataBlast {
  entryYear?: number[];
  graduationYear?: number[];
  listCampus?: string[];
  listFaculty?: string[];
  listProgram?: string[];
  listCity?: string[];
  listDegree?: string[];
  listCountry?: string[];
  listProvince?: string[];
  listGraduationPeriod?: string[];
}

export interface ListDataBlast {
  nim: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface SearchValueProps {
  searchValue: string | null;
}
export interface ICampus {
  campusId: string;
  campusName: string;
}

export interface IFaculty {
  facultyId: string;
  facultyName: string;
}

export interface IProgram {
  programId: number;
  programName: string;
}

export interface ICity {
  cityId: string;
  cityName: string;
}

export interface IDegree {
  degreeId: number;
  degreeName: string;
}

export interface IGraduationPeriod {
  graduationPeriodName: string;
}

export interface ICountry {
  countryId: number;
  countryName: string;
}

export interface IProvince {
  provinceId: number;
  provinceName: string;
}
