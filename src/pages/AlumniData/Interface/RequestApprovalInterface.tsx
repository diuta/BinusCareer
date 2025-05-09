export interface RequestApprovalFilters {
  startDate: Date | null;
  endDate: Date | null;
}

export interface RequestApprovalData {
  approvalId: string;
  requestor: string;
  binusianId: string;
  position: string;
  requestDate: string;
  status: string;
}

export interface RequestApprovalDetailData {
  requestor: string;
  binusianId: string;
  position: string;
  status: string;
  excelDownloadLink: string;
  requestReason: string;
}

export interface RequestDetailAlumniData {
  nim: string;
  name: string;
  campus: string;
  faculty: string;
  program: string;
  entryYear: string;
  graduationYear: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  placeOfBirth: string;
  ipk: string;
}

export interface UnitNameData {
  campusId: string;
  campusName: string;
  facultyId: string;
  facultyName: string;
  programId: string;
  programName: string;
}

export interface SendBackForm {
  approvalId: string;
  sendBackReason: string;
}
