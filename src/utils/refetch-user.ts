import jwtDecode from 'jwt-decode';
import { ApiService } from '../constants/ApiService';
import apiClient from '../config/api-client';
import { setAuthToken } from '../store/authToken/slice';
import { useDispatch } from 'react-redux';
import { ProfileUser } from '../store/profile/types';
import { setProfile, setActiveRole } from '../store/profile/slice';

const GetProfile = async () => {
  const dispatch = useDispatch();
  const response = await apiClient.get(ApiService.getProfile);
  
  dispatch(setAuthToken(response.data));
  const decodedToken = jwtDecode<ProfileUser>(response.data);

  if (typeof decodedToken.organizationRoles === 'string') {
    decodedToken.organizationRoles = JSON.parse(decodedToken.organizationRoles);
  }

  const userData: ProfileUser = {
    userId: decodedToken.userId,
    binusianId: decodedToken.binusianId,
    fullName: decodedToken.fullName,
    position: decodedToken.position,
    email: decodedToken.email,
    currentRole: decodedToken.currentRole,
    currentRoleDetailId: decodedToken.currentRoleDetailId,
    rolePermissions: [],
    organizationRoles: []
  };
  if (Array.isArray(decodedToken.organizationRoles)) {
    userData.organizationRoles = decodedToken.organizationRoles.map((role: any) => ({
      roleId: role.roleId,
      roleName: role.roleName,
      roleDesc: role.roleDesc,
    }));
  }
  const permissions = await apiClient.get(ApiService.getCurrentPermissions);
  userData.rolePermissions = permissions.data;

  dispatch(setProfile(userData));

  if(userData.organizationRoles){
    const findRole = userData.organizationRoles.find(
      (role) => role.roleId.toString() == userData.currentRole
    );
    if (findRole) {
      dispatch(setActiveRole(findRole));
    }
  }
};

export default function RefetchUser(){
  const response = GetProfile();
}