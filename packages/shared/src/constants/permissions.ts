export const PERMISSIONS = {
  // User Management
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_ACTIVATE: "user:activate",
  USER_DEACTIVATE: "user:deactivate",

  // Reseller Management
  RESELLER_CREATE: "reseller:create",
  RESELLER_READ: "reseller:read",
  RESELLER_UPDATE: "reseller:update",
  RESELLER_DELETE: "reseller:delete",

  // Admin Management
  ADMIN_CREATE: "admin:create",
  ADMIN_READ: "admin:read",
  ADMIN_UPDATE: "admin:update",
  ADMIN_DELETE: "admin:delete",

  // Config
  CONFIG_READ: "config:read",
  CONFIG_UPDATE: "config:update",
  CONFIG_GLOBAL: "config:global",

  // Flows
  FLOW_CREATE: "flow:create",
  FLOW_READ: "flow:read",
  FLOW_UPDATE: "flow:update",
  FLOW_DELETE: "flow:delete",

  // Sessions
  SESSION_READ: "session:read",
  SESSION_DELETE: "session:delete",

  // Analytics
  ANALYTICS_READ: "analytics:read",

  // Activity Logs
  ACTIVITY_READ: "activity:read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
