import type {
  ABACResource,
  ABACUser,
  FeatureKey,
  Permission,
  PermissionPattern,
  Role,
} from "./types";

export const ROLE_PERMISSIONS: Record<Role, PermissionPattern[]> = {
  super_admin: ["*"],
  admin: [],
  reseller: [],
  user: [],
};

export function matchesPermission(
  pattern: PermissionPattern,
  permission: Permission,
) {
  if (pattern === "*") return true;
  if (pattern.endsWith(":*")) {
    const [resource] = pattern.split(":");
    return permission.startsWith(`${resource}:`);
  }
  if (pattern.startsWith("*:")) {
    const [, action] = pattern.split(":");
    return permission.endsWith(`:${action}`);
  }
  return pattern === permission;
}

export function hasPermission(user: ABACUser, permission: Permission) {
  if (user.role === "super_admin") return true;
  const patterns = ROLE_PERMISSIONS[user.role] ?? [];
  return patterns.some((pattern) => matchesPermission(pattern, permission));
}

export function canAccessFeature(user: ABACUser, feature: FeatureKey) {
  if (user.role === "super_admin") return true;
  return user.allowedFeatures[feature] ?? false;
}

export function canManageUser(manager: ABACUser, resource?: ABACResource) {
  if (manager.role === "super_admin") return true;
  if (!resource) return false;
  return false;
}
