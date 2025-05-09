export type ViewDataType = {
    engagementId: number;
    parentId: number;
    period: Date;
    date: Date;
    alumniNIM: string;
    alumniName: string;
    campusName: string;
    facultyName: string;
    programName: string;
    degreeName: string;
    unitName: string;
    engagementCategoryName: string;
    engagementCategoryDetailName: string;
    activity: string;
    description: string;
    nominal: number;
    linkEvidence: string;
    reason: string;
    userIn: string;
    proposalStatusName: string;
    approvalStatysName: string;
    actionType: string;
    isDeleted: boolean;
    dateIn: Date;
}

export type ViewApprovalDataType = {
    engagementId: number;
    parentId: number;
    period: Date;
    date: Date;
    alumniNIM: string;
    alumniName: string;
    campusName: string;
    facultyName: string;
    programName: string;
    degreeName: string;
    unitName: string;
    engagementCategoryName: string;
    engagementCategoryDetailName: string;
    activity: string;
    description: string;
    nominal: number;
    linkEvidence: string;
    reason: string;
    sendBackReason: string | null;
    userIn: string;
    proposalStatusName: string;
    approvalStatysName: string;
    actionType: string;
    isDeleted: boolean;
    dateIn: Date;
}

export type ExportDataType = {
    period: string;
    date: string;
    nim: string;
    name: string;
    campus: string;
    faculty: string;
    program: string;
    degree: string;
    unitName: string;
    category: string;
    categoryDetail: string;
    nominal: number;
    activity: string;
    linkEvidence: string;
    description: string;
    status: string;
}