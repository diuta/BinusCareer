export interface IViewUpdateHistoryData{
    fieldName: string;
    previousData : string;
    updatedData : string;
    userUpdated : string;
    timeUpdated : Date;
}

export interface ITableData {
    id: number;
    nim: string;
    name: string;
    campus: string;
    faculty: string;
    program: string;
    leaderProgram : string;
    startYear : Date;
    endYear : Date;
    phoneNumber: string;
    email: string;
    lastActivity: string[];
    requestedDate : Date;
    leaderStatus : string;
    status : string; 
    reason : string;
    sendBackReason : string;
    reasonNotActive : string;
    userIn : string;
    newData: string[];
    approvalId: number;
}

export interface IExportData{
    id: number;
    faculty: string;
    program: string;
    leaderProgram: string;
    degree: string;
    nim: string;
    name: string;
    entryYear: Date;
    graduationYear: Date;
    email : string;
    phoneNumber: string;
    startYear: Date;
    endYear: Date;
    leaderStatus: string;
    reasonNotActive: string;
    status: string;
    actionType: string;
    reason: string;
    sendBackReason: string;
    requestedDate: Date;
}

export interface IFormValues {
    startDate : Date | null,
    endDate : Date | null
}