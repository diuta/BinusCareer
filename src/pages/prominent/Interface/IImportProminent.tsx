export interface IEvidence {
    evidenceType : string;
    evidence: File | string | null;
    id : string;
    isOld: boolean;
}
  
export interface IAchievement {
    achievementCategory: string; 
    achievementName: string;
    achievementEvidence : IEvidence[];
}
  
export interface IInputValue {
    alumniId: string;
    period: string;
    date: string;
    achievements: IAchievement[];
    binusSupport: string;
    userIn : string;
}

export interface IEvidenceSubmit {
    evidenceType : string;
    evidence: string;
}
  
export interface IAchievementSubmit {
    achievementCategory: string; 
    achievementName: string;
    achievementEvidence : IEvidenceSubmit[];
}

export interface ISubmitImport {
    alumniId: string;
    period: string;
    date: string;
    achievements: IAchievementSubmit[];
    binusSupport: string;
    userIn : string;
}
  
export interface IAchievementCategory{
    achievementCategoryId : number;
    achievementCategoryName : string;
}
  
export type ImportType = {
    alumniId: string;
    name: string;
    campus: string;
    faculty: string;
    program: string;
    degree: string;
    period: string;
    date: string;
    achievementCategory: string;
    achievementName: string;
    achievementEvidence : IEvidence[];
    binusSupport: string;
};
  
export type ErrorDataType = {
    alumniNIM: string;
    rowNumber: number;
    errorMessage: string;
};
  