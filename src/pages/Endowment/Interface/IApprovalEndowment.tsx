export type ExportApprovalDataType = {
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
    actionType: string;
    reason: string;
    sendBackReason: string;
    requestedDate: Date;
    requestedBy: string;
}

export type ApproveListType = {
    "endowmentId": number;
    "request": string;
    "userId" : string;
  };