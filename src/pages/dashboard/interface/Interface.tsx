export interface IData {
  id: string;
  name: string;
  value: number;
}

export interface IUpdatedData {
  name: string;
  totalAlumni: number;
  totalUpdated: number;
}

export interface IGeo {
  countryName: string;
  provinceName: string;
  cityName: string;
  totalAlumni: number;
  provLat: number;
  provLong: number;
  countryLat: number;
  countryLong: number;
}

interface IGraduationPeriod {
  period: string;
  graduates: number;
}

export interface IGraduationData {
  year: number;
  periods: IGraduationPeriod[];
}
