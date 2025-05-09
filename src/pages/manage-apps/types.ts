export type FormAppFields = {
    id?: string;
    subAppName: string;
    subAppType: string;
    subAppId: string;
    webType: string;
    webURL: string;
    iosURL: string;
    androidURL: string;
    appStoreId: string;
    appStoreName: string;
    appStoreLocale: string;
    playStoreId: string;
    iconWeb: string | null;
    iconMobile: string | null;
    iconWebExtension: string;
    iconMobileExtension: string;
    isWebView: boolean;
    hideInListApp: boolean;
    description: string;
  };
  
  export type AppRegistrationList = FormAppFields & {
    createdBy: string;
    createdDate: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
  };
  