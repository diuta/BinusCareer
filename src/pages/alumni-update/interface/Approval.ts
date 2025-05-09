import { Alumni } from './Alumni';

export interface ApprovalField {
  fieldName: string;
  value: string;
  isUpdated: boolean;
}

export type ListApproval = Pick<
  Alumni,
  | 'alumniNIM'
  | 'alumniCode'
  | 'alumniName'
  | 'campusName'
  | 'facultyName'
  | 'programName'
> & {
	approvalId: string;
	reason: string;
	childIsUpdated: boolean;
	alumniIsUpdated: boolean;
	alumniUpdateableData: ApprovalField[];
};