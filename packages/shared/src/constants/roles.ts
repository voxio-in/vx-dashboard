export enum Role {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  RESELLER = "reseller",
  USER = "user",
}

export const ROLE_LEVEL: Record<Role, number> = {
  [Role.SUPERADMIN]: 4,
  [Role.ADMIN]: 3,
  [Role.RESELLER]: 2,
  [Role.USER]: 1,
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPERADMIN]: "Super Admin",
  [Role.ADMIN]: "Admin",
  [Role.RESELLER]: "Reseller",
  [Role.USER]: "User",
};
