import { IdentityLogin, IdentityLoginAuth } from '../../types/identity';

export type User = {
  email: string;
};

export type AuthState = {
  user: IdentityLogin;
};

export type AuthSlice = {
  user?: IdentityLoginAuth;
  userAzureAD?: IdentityLoginAuth;
};
