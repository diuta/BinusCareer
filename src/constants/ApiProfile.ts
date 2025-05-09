import { ApiService, subscriptionKeyMyDashboardBinusMaya } from './ApiService';

export const ApiProfile = {
  profile: `${ApiService.profile}/Profile`, // old
  role: `${ApiService.profile}/Role`,
  person: `${ApiService.profile}/Person?subscription-key=${subscriptionKeyMyDashboardBinusMaya}`,
  userProfile: `${ApiService.profile}/UserProfile`, // will be used
  userPrivileges: `${ApiService.profile}/UserPrivileges`,
  modulesByRoleId: (roleId: string) => `${ApiService.profile}/Privileges/Role/${roleId}`,
  detailRoleByRoleId: (roleId: string) => `${ApiService.profile}/Role/${roleId}/Detail`,
  deleteRoleById: (roleId: string) => `${ApiService.profile}/Role/${roleId}`,
  deleteSubRoleTypeById: (subRoleTypeId: string) =>
    `${ApiService.profile}/SubRoleType/${subRoleTypeId}/Delete`,
  allPrivilegesPerModules: `${ApiService.profile}/Privileges`,
  allInstructorPrivileges: `${ApiService.profile}/InstructorPrivileges`,
  allRole: `${ApiService.profile}/Role`,
  roleCategory: `${ApiService.profile}/RoleCategory`,
  mappedAllPrivilegeByRoleId: (roleId: string) =>
    `${ApiService.profile}/Privileges/Role/${roleId}/All`,
  privilegeByRoleId: (roleId: string) => `${ApiService.profile}/Privileges/Role/${roleId}`,
  addRole: `${ApiService.profile}/Role/Add`,
  addRoleType: `${ApiService.profile}/SubRoleType/Add`,
  editRole: (roleId: string) => `${ApiService.profile}/Role/${roleId}/Edit`,
  editRoleType: (roleId: string) => `${ApiService.profile}/SubRoleType/${roleId}/Edit`,
  accountPaging: `${ApiService.profile}/UserManagement/Accounts`,
  institutionManageAccount: `${ApiService.profile}/Filter/Institution`,
  academicCareerManageAccount: `${ApiService.profile}/Filter/AcademicCareer`,
  academicCareerManageAccountByInstitution: (institutionId: string) =>
    `${ApiService.profile}/Filter/AcademicCareer/Institution/${institutionId}`,
  facultyManageAccount: `${ApiService.profile}/Filter/Faculty`,
  departmentManageAccount: `${ApiService.profile}/Filter/Department`,
  roleManageAccount: `${ApiService.profile}/Filter/Role`,
  departmentOptionsDetailAccount: `${ApiService.profile}/Filter/Department`,
  fosOptionsDetailAccount: `${ApiService.profile}/Filter/FOS`,
  sfsOptionsDetailAccount: `${ApiService.profile}/Filter/SFS`,
  accountDetail: (personId: string) =>
    `${ApiService.profile}/UserManagement/Account/Person/${personId}/Detail`,
  roleMapping: (personId: string) =>
    `${ApiService.profile}/UserManagement/Account/Person/${personId}/RoleMapping`,
  saveRoleMapping: (personId: string) =>
    `${ApiService.profile}/UserManagement/Account/Person/${personId}/RoleMapping/Save`,
  // savePerson: (personId: string) => `${ApiService.profile}/UserManagement/Account/Person/${personId}/Save`,
  savePerson: (personId: string) =>
    `${ApiService.profile}/UserManagement/Account/Person/${personId}/Save/V20210816`,
  roleByAcademicCareer: (academicCareer: string) =>
    `${ApiService.profile}/Profile/AcademicCareer/${academicCareer}/Roles`,
  checkuserlogin: `${ApiService.profile}/CheckUserLogin?clientId=apim-apim-bm7-dev`,
  getAppList: `${ApiService.profile}/SuperApp/AppList`,
  createPerson: `${ApiService.profile}/UserManagement/Account/Profile/Create`,
  checkEmailExist: `${ApiService.profile}/UserManagement/Account/Profile/CheckEmailExist`,
  getPrivilegesBySubRoleTypeId: (subRoleTypeId: string) =>
    `${ApiService.profile}/Privilege/SubRoleType/${subRoleTypeId}`,
  getAcademicOperationStaff: `${ApiService.profile}/Filter/GetAcademicOperationStaff`,
  getAccountOnsiteServices: `${ApiService.profile}/GetAccount/OnsiteServices/`,
  getOfflineModeConfiguration: `${ApiService.profile}/GetOfflineModeConfiguration`,
  upsertOfflineModeConfiguration: `${ApiService.profile}/UpsertOfflineModeConfiguration`,
  getOfflineDownloadLog: `${ApiService.profile}/OfflineMode/GetOfflineDownloadLog`,

  // new
  createAppRegistration: `${ApiService.profile}/SubApplication/Create`,
  updateAppRegistration: `${ApiService.profile}/SubApplication/Update`,
  getListApps: `${ApiService.profile}/SubApplication`,
  getListAppsByPerson: `${ApiService.profile}/SubApplicationByPerson`,
  getAppByID: (id: string) => `${ApiService.profile}/SubApplication/${id}`,
  deleteAppByID: (id: string) => `${ApiService.profile}/SubApplication/${id}/Delete`,

  getListRoleCategory: `${ApiService.profile}/RoleCategory`,
  getListMasterPrivilege: `${ApiService.profile}/MasterPrivilege`,
  getListUserPrivileges: `${ApiService.profile}/UserPrivileges`,
  getListMasterPrivilegeAllByID: (id: string) =>
    `${ApiService.profile}/MasterPrivilege/Role/${id}/All`,
  getListMasterPrivilegeByID: (id: string) => `${ApiService.profile}/MasterPrivilege/Role/${id}`,
  getListRoles: `${ApiService.profile}/MasterRole`,
  getRolesByID: (id: string) => `${ApiService.profile}/MasterRole/${id}`,
  createRoleRegistration: `${ApiService.profile}/MasterRole/Create`,
  updateRoleRegistration: (id: string) => `${ApiService.profile}/MasterRole/${id}/Update`,
  deleteRoleByID: (id: string) => `${ApiService.profile}/MasterRole/${id}/Delete`,
  updateDefaultRoleById: (id: string) => `${ApiService.profile}/OrganizationRole/Default/${id}`,

  getListAccount: `${ApiService.profile}/UserManagement/Accounts`,
};
