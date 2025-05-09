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

export type EngagementCategoryDataType = {
    engagementCategoryId: number;
    isDeleted: boolean;
    engagementCategoryName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type EngagementCategoryDetailDataType = {
    engagementCategoryDetailId: number;
    isDeleted: boolean;
    engagementCategoryDetailName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
    nominal: number;
}

export type ErrorDataType = {
    alumniNIM: string;
    rowNumber: number;
    errorMessage: string;
}

export type AddEngagementDataType = {
    alumniId: string | null;
    unitId : string | null;
    engagementCategoryId: number | null;
    engagementCategoryDetailId: number | null;
    parentId: number | null;
    period: Date | null;
    date: Date | null;
    nominal: number | null;
    activity: string | null;
    description: string | null;
    linkEvidence: string | null;
    proposalStatusId: number;
    reason: string | null;
    dateIn: Date | null;
    userIn: string | null;
    dateUp: Date | null;
    userUp: string | null;
}

export type ImportType = {
    id: number;
    nim: string;
    name: string;
    campus: string;
    faculty: string;
    program: string;
    degree: string;
    period: string | null;
    date: string | null;
    unitName: string;
    category: string;
    categoryDetail: string;
    nominal: string;
    activity: string;
    linkEvidence: string;
    description: string;
  };