export interface IAchievementCategory{
    achievementCategoryId : number;
    achievementCategoryName : string;
}

export interface IEvidence {
    id : string;
    evidenceType : string;
    evidence: File | string | null;
    isOld : boolean;
}

export interface IAchievement {
    achievementCategory: number; 
    achievementName: string;
    achievementEvidence : IEvidence[];
    prevId : number;
}

export interface IEvidenceResponse {
    evidenceType : string;
    evidence : string | null;
    isOld : boolean;
}

export interface IAchievementResponse {
    achievementCategory: number; 
    achievementName: string;
    achievementEvidence : IEvidenceResponse[];
    prevId : number | null;
}

export interface IBinusSupport {
    binusSupportDetail: string;
    prevId : number;
}

export interface IFormValues {
    alumniId: string;
    period: Date | null;
    date: Date | null;
    achievements: IAchievement[];
    binusSupport: IBinusSupport[];
    userIn : string;
    reason: string;
}

export interface IAlumniData {
    alumniId:string;
    name:string;
    campus:string;
    faculty:string;
    program:string;
    degree:string;
}

export interface IProminentData{
    alumniId: string;
    prominentId : number;
    period: Date;
    date: Date;
    achievements: IAchievementResponse[];
    binusSupport: IBinusSupport[];
    listActivity:string[];
    parentId: number;
    proposalStatusId : number;
}
