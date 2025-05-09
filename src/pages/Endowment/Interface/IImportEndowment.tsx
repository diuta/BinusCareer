export type EndowmentCategoryDataType = {
    endowmentCategoryId: number;
    isDeleted: boolean;
    endowmentCategoryName: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type ErrorDataType = {
    alumniNIM: string;
    rowNumber: number;
    errorMessage: string;
}

export type AddEndowmentDataType = {
    alumniId: string | null;
    unitId : string | null;
    endowmentCategoryId: number | null;
    parentId: number | null;
    period: Date | null;
    date: Date | null;
    debit: number | null;
    kredit: number | null;
    activity: string | null;
    description: string | null;
    proposalStatusId: number;
    reason: string | null;
    dateIn: Date | null;
    userIn: string | null;
    dateUp: Date | null;
    userUp: string | null;
}

export type ImportType = {
    id: number;
    nim: string | null;
    name: string | null;
    campus: string | null;
    faculty: string | null;
    program: string | null;
    degree: string | null;
    period: string | null;
    date: string | null;
    unitName: string | null;
    category: string | null;
    debit: string | null;
    kredit: string | null;
    activity: string | null;
    description: string | null;
  };