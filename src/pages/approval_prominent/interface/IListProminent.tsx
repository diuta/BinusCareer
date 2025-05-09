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
  Status: string;
  "Action Type": string;
  Reason: string;
  "Send Back Reason": string;
  "Requested By": string;
  "Requested Date": string;
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
  status : string;
  actionType: string;
  reason: string;
  sendBackReason: string;
  requestedBy: string;
  requestedDate: Date;
}

export interface EvidenceObject {
  pathId: number;
  path: string;
}