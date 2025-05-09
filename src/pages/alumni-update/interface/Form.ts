import {
  UpdateAlumniAliveImport,
  UpdateAlumniPassedAwayImport,
} from './Alumni';

export interface ImportFormValues {
  alumniAlive: UpdateAlumniAliveImport[];
  alumniPassedAway: UpdateAlumniPassedAwayImport[];
}

export interface FilterAlumniList {
  filterBy: string;
  filterInput: string;
  campusId: string[];
  facultyId: string[];
  programId: string[];
  degreeId: string[];
  dateOfBirth: string | null;
  entryYear: number[];
  graduationYear: number[];
}
