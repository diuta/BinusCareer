import { IApi } from '../interfaces/IApi';

/**
 * if want to call API, just do (example):
 *
 * const url = `${ApiService.Identity}/YourEndPointHere`;
 */
const baseURL = 'https://ada-api.apps.binus.ac.id';

export const ApiService: IApi = {
  blob: 'https://stresources.blob.core.windows.net/profilepicture',
  identity: 'https://apim-bm7-dev.azure-api.net/func-identity-dev',
  // organization: 'https://apim-bm7-dev.azure-api.net/func-organization-dev',
  profile:
    'https://apim-mydashboardbinusmaya-dev.azure-api.net/func-mydashboardbinusmaya-profile-dev',
  dashboard:
    'https://apim-mydashboardbinusmaya-dev.azure-api.net/func-mydashboardbinusmaya-dashboard-dev',

  auth: `${baseURL}/auth/getTokenADA`,
  getProfile: `${baseURL}/loginADA/refetchProfile`,
  getCurrentPermissions: `${baseURL}/loginADA/getPermissions`,
  getSideMenu: `${baseURL}/sidebar/getSideMenu`,
  changeRole: `${baseURL}/loginADA/changeActiveRole`,
  refreshToken: `${baseURL}/loginADA/refreshToken`,

  // Master Data (temporary sampe nunggu master service)
  // getDegree: `${baseURL}/findAlumni/getDegree`, // nanti endpointnya perlu diubah kalo udah ada masterService
  getGraduationPeriod: `${baseURL}/find-alumni/get-graduation-period`,
  getCFPTable: `${baseURL}/user-management/getCFPTable`,
  getRoleDropdown: `${baseURL}/user-management/getRoleDropdown`,
  getPermissions: `${baseURL}/user-management/getPermissions`,

  // user-management/user-role-detail/...
  userRoleDetail: `${baseURL}/user-management/user-role-detail`,

  // user-management/user/...
  user: `${baseURL}/user-management/user`,

  // user-management/role/...
  role: `${baseURL}/user-management/role`,

  // user-management/role-permission/...
  rolePermission: `${baseURL}/user-management/role-permission`,

  // find-alumni
  findAlumni: `${baseURL}/find-alumni/alumni`,

  // Dashboard
  dashboardGender: `${baseURL}/dashboard/gender`,
  dashboardUpdatedData: `${baseURL}/dashboard/updated-data`,
  dashboardUpdateAlumni: `${baseURL}/dashboard/update-alumni`,
  dashboardDegree : `${baseURL}/dashboard/degree`,
  dashboardCompanyCategory: `${baseURL}/dashboard/company-category`,
  dashboardPositionLevel: `${baseURL}/dashboard/position-level`,
  dashboardGeography: `${baseURL}/dashboard/geography`,
  dashboardCountry: `${baseURL}/dashboard/country`,
  dashboardCity: `${baseURL}/dashboard/city`,
  dashboardGraduation: `${baseURL}/dashboard/graduation`,
  dashboardEndowment: `${baseURL}/dashboard/endowment`,
  dashboardEngagement: `${baseURL}/dashboard/engagement`,
  dashboardTable: `${baseURL}/dashboard/alumni-table`,
  dashboardExport: `${baseURL}/dashboard/export`,

  // storage
  storage: `${baseURL}/storageADA`,

  // Master
  campus: `${baseURL}/master/campuses`,
  companyCategory: `${baseURL}/master/company-categories`,
  faculty: `${baseURL}/master/faculties`,
  program: `${baseURL}/master/programs`,
  degree: `${baseURL}/master/degrees`,
  sector: `${baseURL}/master/sectors`,
  position: `${baseURL}/master/positions`,
  positionLevel: `${baseURL}/master/position-levels`,
  jobCategory: `${baseURL}/master/job-categories`,
  mappingCampusProgram: `${baseURL}/master/mapping-campus-programs`,
  city: `${baseURL}/master/cities`,
  province: `${baseURL}/master/provinces`,
  country: `${baseURL}/master/countries`,
  gender: `${baseURL}/master/genders`,
  graduationPeriod: `${baseURL}/master/graduation-periods`,

  // Datablast
  dataBlast: `${baseURL}/data-blasts`,

  // endowment
  endowment: `${baseURL}/Endowment`,
  endowmentTemplate: `${baseURL}/storage?IsCdn=false&Path=templateImport/Endowment_Import_Template.xlsx`,
  endowmentCategory: `${baseURL}/Category/endowment`,

  // engagement
  engagement: `${baseURL}/Engagement`,
  engagementTemplate: `${baseURL}/storage?IsCdn=false&Path=templateImport/Template_Import_Engagement.xlsx`,
  attachment: `${baseURL}/attachment`,
  engagementCategory: `${baseURL}/Category/engagement`,
  engagementCategoryDetail: `${baseURL}/CategoryDetail/engagement`,

  // Approval Prominent
  getProminentList: `${baseURL}/prominent/approval/getProminentList`,
  getProminentData: `${baseURL}/prominent/approval/getProminentData`,
  saveApprovalStatusId: `${baseURL}/prominent/approval/saveProminentData`,
  getProminentHistory: `${baseURL}/prominent/approval/getProminentHistory`,
  exportExcel: `${baseURL}/prominent/approval/exportProminentData`,

  alumni: `${baseURL}/alumni`,

  // Alumni Association
  alumniAssociation : `${baseURL}/alumni/association`,
  viewUploadedFile : `${baseURL}/storage/cdn`,

  // Prominent
  prominent : `${baseURL}/prominent`,
  viewFileProminent : `${baseURL}/prominent/cdn`,
  getProminentTemplate: `${baseURL}/storage?IsCdn=false&Path=templateImport/Prominent-Import-Template.xlsx`,

  // approval request
  requestApproval: `${baseURL}/request-approval/approval`,

  hangfire: `${baseURL}/hangfire`,
};

export const subscriptionKeyLMSBM7 = '3036affa50694b0fb6ba6552772007c2';
export const subscriptionKeyMyDashboardBinusMaya = 'c01143afab0f4501ac8c34f6586d6a94';
export const gaTrackingID = ''; /** dev */
export const TestMode = true;
export const REDPER = '';
export const ENVIRONMENT = 'development';
