/* eslint-disable @typescript-eslint/no-explicit-any */
export type IADState = { [key: string]: any };

export type IRedirectToADProps = {
  /**
    Can be used to pre-fill the username/email address field of the sign in page for the user, if you know their username ahead of time. Often apps will use this parameter during reauthentication, having already extracted the username from a previous sign-in using the preferred_username claim.
   */
  loginHint?: string;

  /**
    Indicates the type of user interaction that is required. The only valid values at this time are 'login', 'none', 'select_account', and 'consent'. prompt=login will force the user to enter their credentials on that request, negating single-sign on. prompt=none is the opposite - it will ensure that the user isn't presented with any interactive prompt whatsoever. If the request can't be completed silently via single-sign on, the Microsoft identity platform will return an error. prompt=select_account sends the user to an account picker where all of the accounts remembered in the session will appear. prompt=consent will trigger the OAuth consent dialog after the user signs in, asking the user to grant permissions to the app.
   */
  prompt?: 'login' | 'select_account' | 'consent' | 'none';

  /**
   * redirect to specific page after logged in
   */
  state?: IADState;
};

export type ResultDataAD = {
  code?: unknown;
  access_token?: string;
  token_type?: 'Bearer';
  expires_in?: number;
  scope?: string;
  id_token?: unknown;
  state?: { [key: string]: any };

  /**
   * possibility value : 'interaction_required' | 'consent_required' | 'login_required' | 'user_authentication_required'
   */
  error?: string;
  error_description?: string;

  _success: boolean;
};
