export interface Data {
    index: number;
    id: number;
    Period: Date;
    Date: Date;
    Nim: string;
    Name: string;
    Campus: string;
    Faculty: string;
    Program: string;
    Degree: string;
    AchievementCategory: string;
    Achievement: string;
    AchievementEvidence: string;
    BinusSupport: string;
    BinusContribution: string;
    BinusContributionValue: string;
    Endowment: string;
    EndowmentValue: string;
    Status: string;
    ActionType: string;
    Reason: string;
    SendBackReason: string;
    requestedDate: Date;
}

export interface HeadCell {
    id: keyof Data | 'actions';
    label: string;
    numeric: boolean;
}
