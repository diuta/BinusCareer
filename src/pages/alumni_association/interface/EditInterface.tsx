export interface IFormValues {
    mappingLeaderId:number,
    startYear:Date | null,
    endYear:Date | null,
    status: string,
    reason : string,
    reasonNotActive : string,
    userIn: string,
}

export interface IAlumniData {
    mappingLeaderId:number;
    name: string;
    nim:string;
    campus: string;
    faculty: string;
    program: string;
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
    activity: string[];
    proposalStatusId : number;
}