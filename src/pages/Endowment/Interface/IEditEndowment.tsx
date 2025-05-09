export type ViewEditDataType = {
    endowmentId: number;
    alumniId: string;
    unitId: string;
    endowmentCategoryId: number;
    isDeleted: boolean;
    parentId: number;
    period: Date;
    date: Date;
    debit: number;
    kredit: number;
    activity: string;
    description: string;
    proposalStatusId: number;
    reason: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export type TrAttachmentDataType = {
    documentId: number;
    isDeleted: boolean;
    fieldName: string;
    refTable: string;
    refId: number;
    path: string;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
}

export interface IFormValues {
    unitId: string | null;
    endowmentCategoryId: number | null;
    period: string;
    date: string;
    debit: number | string | null;
    kredit: number | string | null;
    activity: string | null;
    description: string | null;
    reason: string | null;
}