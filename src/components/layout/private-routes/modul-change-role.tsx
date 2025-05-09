/* eslint-disable react/no-array-index-key */
import CloseIcon from "@mui/icons-material/Close";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQueryUpdateDefaultRole } from "../../../api/role-registration";
import { AnimatePresence, motion } from "framer-motion";
import uniqBy from "lodash.uniqby";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProfileActiveRole,
  selectProfileOrganizationRoles,
  selectProfile,
} from "../../../store/profile/selector";
import { setActiveRole, setProfile } from "../../../store/profile/slice";
import { layoutPrivateStyle } from "../../../styles/layout/private-routes";
import { ModalChangeRolesProps } from "../../../types/modal-change-roles";
import { RoleCategoryProps } from "../../../types/role-category";
import { useNavigate } from "react-router-dom";
import { UserRoleCard } from "./user-role-card";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import jwtDecode from "jwt-decode";
import { ProfileUser } from "../../../store/profile/types";
import { setAuthToken } from "../../../store/authToken/slice";

export function ModulChangeRole({
  modalChangeRoles,
  setModalChangeRoles,
  organizationRoles,
}: ModalChangeRolesProps) {
  // const organizationRoles = useSelector(selectProfileOrganizationRoles);
  const userProfile = useSelector(selectProfile);

  const activeRole = useSelector(selectProfileActiveRole);
  const [selectedRole, setSelectedRole] = useState(activeRole);

  const [isRoleChanged, setIsRoleChanged] = useState(false);

  const Navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedRole(activeRole);
  }, [activeRole]);

  const handleChoose = async () => {
    const request = {
      RoleId: selectedRole?.roleId,
    };
    const response = await apiClient.post(ApiService.changeRole, request);
    dispatch(setAuthToken(response.data));
    const decodedToken = jwtDecode<ProfileUser>(response.data);

    if (typeof decodedToken.organizationRoles === "string") {
      decodedToken.organizationRoles = JSON.parse(
        decodedToken.organizationRoles
      );
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
      organizationRoles: [],
    };
    if (Array.isArray(decodedToken.organizationRoles)) {
      userData.organizationRoles = decodedToken.organizationRoles.map(
        (role: any) => ({
          roleId: role.roleId,
          roleName: role.roleName,
          roleDesc: role.roleDesc,
        })
      );
    }
    const permissions = await apiClient.get(ApiService.getCurrentPermissions);
    userData.rolePermissions = permissions.data;

    dispatch(setProfile(userData));

    if (userData.organizationRoles) {
      const findRole = userData.organizationRoles.find(
        (role) => role.roleId.toString() == userData.currentRole
      );
      if (findRole) {
        dispatch(setActiveRole(findRole));
      }
    }
    setModalChangeRoles?.(!modalChangeRoles);

    setIsRoleChanged(true);
  };

  useEffect(() => {
    if (isRoleChanged) {
      window.location.href = "/";
    }
  }, [isRoleChanged]);

  return (
    <AnimatePresence initial={false} mode="wait">
      {modalChangeRoles && (
        <motion.div
          initial={{
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: 10,
            height: "615px",
            width: "0",
            display: "flex",
            justifyContent: "center",
            opacity: "0",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            top: modalChangeRoles ? "60%" : "0",
            opacity: modalChangeRoles ? "100%" : "0%",
          }}
          exit={{
            top: "55%",
            opacity: "0",
          }}
        >
          <Box sx={layoutPrivateStyle.modalChange}>
            <Stack sx={layoutPrivateStyle.modalChangeStack1}>
              <Typography sx={layoutPrivateStyle.modalChangeTitle}>
                Change Role
              </Typography>
              <CloseIcon
                sx={layoutPrivateStyle.modalChangeIcon}
                onClick={() => setModalChangeRoles?.(!modalChangeRoles)}
              />
            </Stack>
            <Box sx={{ height: "355px", padding: "10px" }}>
              <Box sx={layoutPrivateStyle.modalChangeStack3}>
                <Stack sx={layoutPrivateStyle.modalChangeStack4}>
                  {organizationRoles &&
                    organizationRoles.map((role) => (
                      <Box
                        sx={layoutPrivateStyle.userRoleBox}
                        key={role.roleId}
                        onClick={() => setSelectedRole(role)}
                      >
                        <UserRoleCard
                          role={role}
                          isActive={selectedRole?.roleId == role.roleId}
                        />
                      </Box>
                    ))}
                </Stack>
              </Box>
            </Box>
            <Stack sx={layoutPrivateStyle.modalChangeStack5}>
              <Button
                variant="contained"
                color="primary"
                sx={layoutPrivateStyle.modalChangeButton}
                onClick={handleChoose}
              >
                <Typography sx={{ fontWeight: "600", fontSize: "13px" }}>
                  Choose
                </Typography>
              </Button>
            </Stack>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
