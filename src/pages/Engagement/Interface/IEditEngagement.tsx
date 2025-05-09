export type ViewEditDataType = {
    engagementId: number;
    alumniId: string;
    unitId: string;
    engagementCategoryId: number;
    engagementCategoryDetailId: number;
    isDeleted: boolean;
    parentId: number;
    period: Date;
    date: Date;
    nominal: number;
    activity: string;
    description: string;
    linkEvidence: string;
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