import { RootState } from '../store';
import { OrganizationRole, ProfileUser } from './types';

export const selectProfile = (state: RootState): ProfileUser => state.profile.userProfile;
export const selectProfileOrganizationRoles = (state: RootState): OrganizationRole[] =>
  state.profile.userProfile.organizationRoles;
export const selectProfileActiveRole = (state: RootState): OrganizationRole =>
  state.profile.activeRole;
export const selectProfileAlternateEmails = (state: RootState): string[] =>
  state.profile.userProfile.alternateEmails;
export const selectProfilePrivileges = (state: RootState): string[] => state.profile.privileges;
