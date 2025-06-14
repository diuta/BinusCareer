import { IApi } from "../interfaces/IApi";

/**
 * if want to call API, just do (example):
 *
 * const url = `${ApiService.Identity}/YourEndPointHere`;
 *
 */

const baseURL = "http://localhost:10004";

export const ApiService: IApi = {
  blob: "https://stresources.blob.core.windows.net/profilepicture",
  identity: "https://apim-bm7-dev.azure-api.net/func-identity-dev",
  // organization: 'https://apim-bm7-dev.azure-api.net/func-organization-dev',
  profile:
    "https://apim-mydashboardbinusmaya-dev.azure-api.net/func-mydashboardbinusmaya-profile-dev",
  // dashboard:
  // 'https://apim-mydashboardbinusmaya-dev.azure-api.net/func-mydashboardbinusmaya-dashboard-dev',

  auth: `${baseURL}/auth/getTokenADA`,
  getProfile: `${baseURL}/loginADA/refetchProfile`,
  getCurrentPermissions: `${baseURL}/loginADA/getPermissions`,
  getSideMenu: `${baseURL}/sidebar/getSideMenu`,
  changeRole: `${baseURL}/loginADA/changeActiveRole`,
  refreshToken: `${baseURL}/api/User/refresh-token`,

  URL: `${baseURL}`,

  // Carousel
  carousels: `${baseURL}/api/Carousel`,

  // Category
  categories: `${baseURL}/api/Category`,

  // Article
  articles: `${baseURL}/api/Article`,

  // User
  login: `${baseURL}/api/User/login`,
  register: `${baseURL}/api/User/register`,
  revokeToken: `${baseURL}/api/User/revoke-token`,
};

export const subscriptionKeyLMSBM7 = "3036affa50694b0fb6ba6552772007c2";
export const subscriptionKeyMyDashboardBinusMaya =
  "c01143afab0f4501ac8c34f6586d6a94";
export const gaTrackingID = ""; /** dev */
export const TestMode = true;
export const REDPER = "";
export const ENVIRONMENT = "development";
