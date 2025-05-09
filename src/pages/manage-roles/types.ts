export type SubModulePrivilege = {
    id: string;
    privilegesCode: string;
    privilegesName: string;
    privilegesDescription: string;
    isPermitted: boolean;
    isMenu: boolean;
    isRelatedToClassSession: boolean;
    mandatoryPrivileges: [];
    referencePrivileges: [];
    childPrivileges: [];
    priorityIndex: number;
  };
  
  export type SubModule = {
    subModuleId: string;
    subModuleCode: string;
    subModuleName: string;
    subModuleDescription: string;
    privileges: SubModulePrivilege[];
  };
  
  export type FormMasterPrivilegeFields = {
    moduleId: string;
    moduleCode: string;
    moduleName: string;
    moduleDescription: string;
    subModules: SubModule[];
  };
  
  export type FormRoleFields = {
    type: string;
    name: string;
    nameLower: string;
    description: string;
    descriptionLower: string;
    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    isNotEditable: boolean;
    isBeingPropagated: boolean;
    completedPropagateDateUtc: boolean;
    roleCategoryId: string;
    roleCategoryName: string;
    roleCategoryCode: string;
    code: string;
    createdDateUTC: string;
    lastUpdatedDateUtc: string;
    id: string;
    documentType: string;
    documentNamespace: string;
    partitionKey: string;
    createdDate: string;
    createdBy: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
    activeFlag: string;
    privilegeIds: string[];
    _etag: string;
  };
  
  export type RoleCategoryList = {
    name: string;
    code: string;
    createdDateUTC: string;
    lastUpdatedDateUtc: string;
    id: string;
    documentType: string;
    documentNamespace: string;
    partitionKey: string;
    createdDate: string;
    createdBy: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
    activeFlag: string;
    _etag: string;
  };
  