import { Role } from "../constants/roles";
import { Permission } from "../constants/permissions";
import { UIComponentId } from "../constants/ui-registry";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  parentId?: string; // admin or reseller who owns this user
  permissions: Permission[]; // custom per-user permissions
  uiOverrides: UIComponentId[]; // hidden UI elements for this user
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // soft delete
}

export interface IUserSummary {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export type CreateUserPayload = Pick<
  IUser,
  "name" | "email" | "role" | "parentId"
>;
export type UpdateUserPayload = Partial<
  Pick<IUser, "name" | "email" | "isActive" | "permissions" | "uiOverrides">
>;
