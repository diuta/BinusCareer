export interface IProminentFilterFormValue {
  campusId: string[];
  facultyId: string[];
  programId: string[];
  degreeId: string[];
}

export interface IMappingCampusProgramProps {
    facultyId: string;
    programId: string;
    campusId: string;
}

export interface ITableListProminent {
    prominentId : number;
    period : Date;
    date : Date;
    nim : string;
    name : string;
    campus : string;
    faculty : string;
    program : string;
    degree : string;
    totalAchievement : number;
    totalBinusSupport : number;
    binusContribution : number;
    totalBinusContribution : number;
    endowment : number;
    endowmentValue : number;
    lastUpdate : Date;
    updatedBy : string;
    status : string;
}

export interface IAchievement {
    achievementCategory: string; 
    achievementName: string;
    achievementEvidence : IEvidence[];
}

export interface IEvidence {
    evidenceType : string;
    evidence : string;
}

export interface IRowData {
    Periode: string;
    Date: string;
    NIM: string;
    Name: string;
    Campus: string;
    Faculty: string;
    Program: string;
    Degree: string;
    "Achievement Category": string;
    Achievement: string;
    "Achievement Evidence": string;
    "Binus Support": string;
    "Binus Contribution": string;
    "Binus Contribution Value": string;
    Endowment: string;
    "Endowment Value": string;
    Status: string;
}

export interface IExportData {
    prominentId : number;
    period : Date;
    date : Date;
    nim : string;
    name : string;
    campus : string;
    faculty : string;
    program : string;
    degree : string;
    achievement : IAchievement[];
    binusSupport : string[];
    binusContribution : string[];
    binusContributionValue : string[];
    endowmentName : string[];
    endowmentValue : string[];
    status : string;
}