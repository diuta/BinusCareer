import { ApiService, subscriptionKeyLMSBM7 } from "./ApiService";

export const ApiIdentity = {
  baseAPI: `${ApiService.identity}`,
  signInByAzureAd: `${ApiService.identity}/SignInByAzureAD?subscription-key=${subscriptionKeyLMSBM7}`,
  signInByAzureAdV2: `${ApiService.identity}/AccessAndRefreshToken/AzureAD?subscription-key=${subscriptionKeyLMSBM7}`,
  signInByEmail: `${ApiService.identity}/SignInByEmail?subscription-key=${subscriptionKeyLMSBM7}`,
  signInByEmailV2: `${ApiService.identity}/AccessAndRefreshToken/Email?subscription-key=${subscriptionKeyLMSBM7}`,
  refreshAccessToken: `${ApiService.refreshToken}`,
  revokeRefreshToken: `${ApiService.revokeToken}`,
  getTokenSettings: `${ApiService.identity}/GetTokenSettings`,
  upsertTokenSetting: `${ApiService.identity}/UpsertTokenSetting`,
  deleteTokenSetting: (campus: string, tokenSettingId: string) =>
    `${ApiService.identity}/TokenSetting/Delete/Campus/${campus}/TokenSetting/${tokenSettingId}`,
  getOTPCountryCode: `${ApiService.identity}/OTP/GetOTPCountryCode`,
  saveByPassOTP: `${ApiService.identity}/SaveByPassOTP`,
  getOTPCampus: `${ApiService.identity}/OTP/GetOTPCampus`,
};
