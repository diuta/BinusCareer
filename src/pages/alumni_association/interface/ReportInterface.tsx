export interface ITableData {
    id:number;
    nim: string;
    name: string;
    campus: string;
    faculty: string;
    program: string;
    leaderProgram:string;
    degree: string;
    birthPlace: string;
    dob : Date;
    entryYear : Date;
    graduationYear: Date;
    email: string;
    phoneNumber: string;
    yearStart: Date;
    yearEnd: Date;
    leaderStatus: string;
    reasonNotActive: string;
    status: string;
    activity: string[];
    createdDate:Date;
}

export interface IMappingCampusProgramProps {
    facultyId: string;
    programId: string;
    campusId: string;
}

export interface IReportFilterFormValue {
    campusId: string[];
    facultyId: string[];
    programId: string[];
    degreeId: string[];
    leaderStatus: string;
}

export interface IExportReportData{
    facultyName: string,
    alumniProgram: string, 
    leaderProgram: string,
    degree : string, 
    leaderStatus : string, 
    reasonNotActive : string, 
    status : string, 
    nim : string, 
    name : string, 
    entryYear : Date, 
    graduationYear : Date, 
    email : string, 
    phoneNumber : string, 
    createdDate : Date, 
    startPeriod : Date, 
    endPeriod: Date, 
}