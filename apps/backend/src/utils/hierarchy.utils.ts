import { Role, ROLE_LEVEL } from "@vx/shared";

export const isAtLeast = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[requiredRole];
};

export const canManageUser = (managerRole: Role, targetRole: Role): boolean => {
  return ROLE_LEVEL[managerRole] > ROLE_LEVEL[targetRole];
};
