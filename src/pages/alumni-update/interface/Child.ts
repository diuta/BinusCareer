export interface Child {
  alumniChildId: string;
  alumniChildName: string;
  alumniChildDateBirth: string;
  alumniChildGenderId: string;
  alumniChildCountryId: string;
}

export interface ChildUpdatePayload extends Child {
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
}

export interface ChildLog {
  previous: Child;
  updated: Child;
  changedFieldName: string[];
  childId: number;
}
