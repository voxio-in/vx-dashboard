export const UI_REGISTRY = {
  // Sidebar Items
  SIDEBAR_DASHBOARD: "sidebar:dashboard",
  SIDEBAR_USERS: "sidebar:users",
  SIDEBAR_RESELLERS: "sidebar:resellers",
  SIDEBAR_ADMINS: "sidebar:admins",
  SIDEBAR_FLOWS: "sidebar:flows",
  SIDEBAR_SESSIONS: "sidebar:sessions",
  SIDEBAR_ANALYTICS: "sidebar:analytics",
  SIDEBAR_SETTINGS: "sidebar:settings",
  SIDEBAR_UI_CONFIG: "sidebar:ui-config",

  // Buttons / Actions
  BTN_CREATE_USER: "btn:create-user",
  BTN_DELETE_USER: "btn:delete-user",
  BTN_EDIT_USER: "btn:edit-user",
  BTN_ACTIVATE_USER: "btn:activate-user",
  BTN_CREATE_RESELLER: "btn:create-reseller",
  BTN_DELETE_RESELLER: "btn:delete-reseller",
  BTN_CREATE_FLOW: "btn:create-flow",
  BTN_DELETE_FLOW: "btn:delete-flow",

  // Sections / Panels
  SECTION_ANALYTICS: "section:analytics",
  SECTION_ACTIVITY_LOG: "section:activity-log",
  SECTION_PERMISSIONS: "section:permissions",
  SECTION_CONFIG_OVERRIDE: "section:config-override",

  // Table Columns
  COL_USER_EMAIL: "col:user-email",
  COL_USER_ROLE: "col:user-role",
  COL_USER_STATUS: "col:user-status",
  COL_USER_CREATED: "col:user-created",
} as const;

export type UIComponentId = (typeof UI_REGISTRY)[keyof typeof UI_REGISTRY];
