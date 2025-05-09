export type EngagementCategory = {
    engagementCategoryId: number;
    isDeleted: boolean;
    engagementCategoryName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date | null;
    userUp: string | null;
}

export type EngagementCategoryDetail = {
    engagementCategoryDetailId: number;
    isDeleted: boolean;
    engagementCategoryDetailName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date | null;
    userUp: string | null;
    nominal: number;
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