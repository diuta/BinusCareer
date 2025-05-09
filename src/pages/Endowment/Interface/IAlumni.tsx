export type AlumniDataType = {
    alumniId: number;
    degreeId: number;
    collegeProgramId: number;
    minorProgramId: number;
    religionId: number;
    genderId: number;
    studentTrackId: number;
    jobCategoryId: number;
    positionId: number;
    cityId: number;
    isDeleted: boolean;
    alumniBinusianId: string;
    alumniNIM: string;
    alumniName: string;
    alive: boolean;
    alumniPlaceBirth:string; 
    alumniDateBirth: Date;
    isBinusSquare: boolean;
    entryDate: Date;
    graduationDate: Date;
    updateYear: Date;
    isUpdated: boolean;
    dateIn: Date;
    userIn: string;
    dateUp: Date;
    userUp: string;
    mappingCampusProgramId: number;
    NationalityId: number;
    SectorId: number;
    CompanyCategoryId: number;
    PositionLevelId: number;
    GraduationPeriod: number;
    GraduationYear: Date;
    CompanyName: string;
    CompanyAddress: string;
    CountryId: string;
    ProvinceId: string;
}

export type AlumniDetailDataType = {
    alumniId: number;
    alumniNim: string;
    alumniName: string;
    campusName: string;
    facultyName: string;
    programName: string;
    degreeName: string;
    mappingCampusProgramId: string;
}