/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import Keys from '../constants/Keys';
import QueryString from 'qs';
import { IADState, IRedirectToADProps, ResultDataAD } from '../types/azure-ad';
import { Buffer } from 'buffer';

// Msal Configurations
const config: Configuration = {
  auth: {
    authority: `https://login.microsoftonline.com/${Keys.TenantID}`,
    clientId: Keys.ClientID || '',
    redirectUri: `${window.location.origin}/login`,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            // console.error(message);
            break;
          case LogLevel.Info:
            // console.info(message);
            break;
          case LogLevel.Verbose:
            // console.debug(message);
            break;
          case LogLevel.Warning:
            // console.warn(message);
            break;
          default:
        }
      },
    },
  },
};

// Authentication Parameters
export const loginRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account',
  response_type: 'token',
  extraQueryParameters: {
    login_hint: '',
    response_type: 'token',
  },
};

export const authConfig = new PublicClientApplication(config);

export const ADState = {
  stringify: (value: IADState): string => {
    const json = JSON.stringify(value);
    // btoa(json);
    const base64 = Buffer.from(json).toString('base64');
    return encodeURIComponent(base64);
  },
  parse: (value: string): IADState => {
    const base64 = decodeURIComponent(value);
    // atob(base64);
    const str = Buffer.from(base64, 'base64').toString();
    return JSON.parse(str);
  },
};
export function redirectToAzureAd(args?: IRedirectToADProps) {
  let url = `${config.auth.authority}/oauth2/v2.0/authorize?`;
  url += `client_id=${config.auth.clientId}`;
  url += '&response_type=token';
  url += '&response_mode=fragment';

  url += `&redirect_uri=${window.location.origin}/login`;
  if (args?.state) {
    url += `&state=${ADState.stringify(args?.state)}`;
  }

  url += '&scope=user.read%20openid%20profile%20calendars.read';
  if (args?.prompt) {
    url += `&prompt=${args.prompt}`;
  }
  if (args?.loginHint) {
    url += `&login_hint=${args.loginHint}`;
  }

  window.open(url, '_self');
}

export function parseDataAzureAD(value: string): ResultDataAD {
  // ignore leading hash
  if (value[0] === '#') value = value.slice(1, 1 + value.length);

  const s = QueryString.parse(value, { ignoreQueryPrefix: true });
  const result = s as unknown as ResultDataAD;

  // eslint-disable-next-line no-underscore-dangle
  result._success = !(result.error !== undefined && result.error_description !== undefined);
  if (s.state) result.state = ADState.parse(s.state as string);

  return result;
}
