export interface IAlumniData {
    id:string;
    name:string;
    mappingId: string;
    campus:string;
    faculty:string;
    program:string;
    degree:string;
    placeOfBirth:string;
    dob:Date;
    phoneNumber:string;
    email:string;
    entryYear:Date;
    graduationYear:Date;
    listActivity:string[];
}

export interface IProgram {
    id: string,
    programName: string,
}

export interface IFormValues {
    alumniId:string,  
    startYear:Date | null,
    endYear:Date | null,
    image: File | null,
    confirmationLetter: File | null,
    selectedPrograms: string[],
    userIn: string;
}