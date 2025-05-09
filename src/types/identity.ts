export type IdentityLogin = {
  loginName: string;
  password: string;
};

export type IdentityLoginAzureAD = {
  accessToken: string;
  refreshToken?: string;
};

export type IdentityLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type BearerToken = {
  data: string;
};

export type IdentityLoginAuth = {
  token: string;
  name: string;
  id: string;
  avatar: string;
};

export type IdentityAuth = {
  user: IdentityLoginAuth;
};

export type AuthenticateRequest = {
  username: string;
  password: string;
};

export type AuthenticateResponse = {
  id: number;
  username: string;
  email: string;
  jwtToken: string;
  refreshToken?: string; 
};

export type RevokeTokenRequest = {
  token?: string;
};

export type IdentityAzureADAuth = {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  acct: number;
  acr: string;
  acrs: string[];
  aio: string;
  amr: string[];
  app_displayname: string;
  appid: string;
  appidacr: string;
  family_name: string;
  given_name: string;
  idtyp: string;
  ipaddr: string;
  name: string;
  oid: string;
  onprem_sid: string;
  platf: string;
  puid: string;
  rh: string;
  scp: string;
  sub: string;
  tenant_region_scope: string;
  tid: string;
  unique_name: string;
  upn: string;
  uti: string;
  ver: string;
  xms_st: {
    sub: string;
  };
  xms_tcdt: number;
};
