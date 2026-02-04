import type {
  ABACResource,
  ABACUser,
  ComponentKey,
  FeatureKey,
  LimitKey,
  MenuItem,
  Permission,
  UserUsage,
} from "./types";
import { MENU_ITEMS } from "./menu-items";
import { canAccessFeature, canManageUser, hasPermission } from "./policies";

const LIMIT_USAGE_MAP: Record<LimitKey, keyof UserUsage> = {
  maxUsers: "currentUsers",
  maxFlows: "currentFlows",
  maxApiCalls: "currentApiCalls",
  storageLimit: "storageUsed",
};

export class ABACEngine {
  can(user: ABACUser, permission: Permission, resource?: ABACResource) {
    if (user.role === "super_admin") return true;
    if (!hasPermission(user, permission)) return false;
    if (!resource) return true;
    return this.checkResourceOwnership(user, resource);
  }

  canAccess(user: ABACUser, feature: FeatureKey) {
    return canAccessFeature(user, feature);
  }

  canAccessComponent(user: ABACUser, component: ComponentKey) {
    if (user.role === "super_admin") return true;
    return user.allowedComponents.includes(component);
  }

  canManage(manager: ABACUser, resource?: ABACResource) {
    return canManageUser(manager, resource);
  }

  hasReachedLimit(user: ABACUser, limitKey: LimitKey) {
    if (user.role === "super_admin") return false;
    if (!user.limits || !user.usage) return false;
    const usageKey = LIMIT_USAGE_MAP[limitKey];
    const limitValue = user.limits[limitKey];
    const usageValue = user.usage[usageKey];
    return usageValue >= limitValue;
  }

  checkResourceOwnership(user: ABACUser, resource: ABACResource) {
    if (user.role === "super_admin") return true;
    const userId = user.id;
    if (!userId) return false;
    if (resource.ownerId && resource.ownerId === userId) return true;
    if (resource.userId && resource.userId === userId) return true;
    if (resource.createdBy && resource.createdBy === userId) return true;
    if (
      resource.parentReseller &&
      user.parentReseller &&
      resource.parentReseller === user.parentReseller
    ) {
      return true;
    }
    if (resource.resellerId && resource.resellerId === userId) return true;
    return false;
  }

  getVisibleMenuItems(user: ABACUser): MenuItem[] {
    const baseItems = MENU_ITEMS.filter((item) => {
      if (item.roles && !item.roles.includes(user.role)) return false;
      if (item.permission && !this.can(user, item.permission)) return false;
      if (item.feature && !this.canAccess(user, item.feature)) return false;
      if (item.component && !this.canAccessComponent(user, item.component)) {
        return false;
      }
      return true;
    });

    const visible = user.sidebarConfig?.visibleMenuItems;
    const filtered = Array.isArray(visible) && visible.length > 0
      ? baseItems.filter((item) => visible.includes(item.id))
      : baseItems;

    const order = user.sidebarConfig?.menuOrder;
    if (!order || order.length === 0) return filtered;
    const orderMap = new Map(order.map((id, index) => [id, index]));
    return [...filtered].sort((a, b) => {
      const aIndex = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
  }
}

export const abac = new ABACEngine();
