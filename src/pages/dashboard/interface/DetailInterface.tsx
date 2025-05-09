import { IData } from "./Interface";

export type ListDetailDashboard = {
    alumniNIM: string;
    alumniName: string;
    campusName: string
    facultyName: string;
    programName: string;
    degreeName: string;
    sectorName: string;
    jobCategoryName: string;
    entryYear: string;
    graduationYear: string;
    companyName: string;
    companyCategoryName: string;
    positionName: string;
    positionLevelName: string;
}

export type SearchFilters = {
    filter: {
        campusId: string[];
        facultyId: string[];
        programId: string[];
        degreeId: string[];
        sectorId: string[];
        companyCategoryId: string[];
        jobCategoryId: string[];
        positionLevelId: string[];
        countryId?: string[];
        provinceId?: string[];
        cityId?: string[];
        entryYear: number[];
        graduationYear: number[];
    },
}

export type DataRequests = {
    request: {
        phone: boolean;
        email: boolean;
        dob: boolean;
        pob: boolean;
        gpa: boolean
    }
    reason: string;
}

export type ExportModal = {
    variant: string;
    open: boolean;
    title: string;
    message: string;
    button: string;
}

export type ChartData = {
    loaded: boolean;
    data: IData[];
    radius: {
        inner: string;
        outer: string;
    }
}