export type EndowmentCategory = {
    endowmentCategoryId: number;
    isDeleted: boolean;
    endowmentCategoryName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date | null;
    userUp: string | null;
}

export type CampusDataType = {
    campusId: number;
    isDeleted: boolean;
    campusName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type FacultyDataType = {
    facultyId: number;
    campusId: number;
    isDeleted: boolean;
    facultyName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type ProgramDataType = {
    programId: number;
    facultyId: number;
    isDeleted: boolean;
    programName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type DegreeDataType = {
    DegreeId: number;
    isDeleted: boolean;
    degreeName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type TrMappingCampusProgram = {
    mappingCampusProgramId: string;
    campusId: string;
    campusName: string;
    facultyId: string;
    facultyName: string;
    programId: string;
    programName: string;
    isDeleted: boolean;
    dateIn: Date;
    userIn: string;
    dateUp: Date | null;
    userUp: string | null;
}

export type MappingCampusDataType = {
    mappingCampusProgramId: string;
    campusId: string;
    facultyId: string;
    programId: number;
    isDeleted: boolean;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}