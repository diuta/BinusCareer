export type ViewDataType = {
    endowmentId: number;
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
    endowmentCategoryName: string;
    activity: string;
    description: string;
    debit: number;
    kredit: number;
    reason: string;
    userIn: string;
    proposalStatusName: string;
    approvalStatysName: string;
    actionType: string;
    isDeleted: boolean;
    dateIn: Date;
}

export type ViewApprovalDataType = {
    endowmentId: number;
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
    endowmentCategoryName: string;
    activity: string;
    description: string;
    debit: number;
    kredit: number;
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
    debit: number;
    kredit: number;
    activity: string;
    description: string;
    status: string;
}