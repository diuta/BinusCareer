import { Buffer } from 'buffer';
import { ApiService } from '../constants/ApiService';
import jwtDecode from 'jwt-decode';
import { IdentityLoginAuth } from '../types/identity';

export function getTokenPayload(token: string): IdentityLoginAuth {
  // [header, payload, signature]: string[] = token.split('.');
  const [, payload]: string[] = token.split('.');

  const payloadResult = JSON.parse(Buffer.from(payload, 'base64').toString());
  const id = payloadResult['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  const name = payloadResult['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  const avatar = `${ApiService.blob}/${id}.jpg`;

  return {
    id,
    name,
    avatar,
    token,
  };
}

export function getAzureADTokenPayload(token: string) {
  return jwtDecode(token);
}
