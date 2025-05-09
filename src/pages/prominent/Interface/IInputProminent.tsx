export interface IAchievementCategory{
    achievementCategoryId : number;
    achievementCategoryName : string;
}

export interface IEvidence {
    id: string;
    evidenceType : string;
    evidence : File | string | null;
}

export interface IAchievement {
    achievementCategory: number; 
    achievementName: string;
    achievementEvidence : IEvidence[];
}

export interface IFormValues {
    alumniId: string;
    period: string | null;
    date: Date | null;
    achievements: IAchievement[];
    binusSupport: string[];
    userIn : string;
}

export interface IAlumniData {
    alumniId: string;
    name:string;
    nim:string;
    mappingId : string;
    campus:string;
    faculty:string;
    program:string;
    degree:string;
}