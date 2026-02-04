export type Role = "super_admin" | "admin" | "reseller" | "user";

export type Resource =
  | "dashboard"
  | "services"
  | "users"
  | "resellers"
  | "flows"
  | "agents"
  | "analytics"
  | "system"
  | "billing"
  | "component"
  | "session";

export type Action = "create" | "read" | "update" | "delete" | "manage" | "access";

export type Permission = `${Resource}:${Action}`;

export type PermissionPattern =
  | Permission
  | "*"
  | `${Resource}:*`
  | `*:${Action}`;

export type FeatureKey =
  | "dashboard"
  | "services"
  | "analytics"
  | "flows"
  | "createFlow"
  | "deleteFlow"
  | "agentConfig"
  | "sttConfig"
  | "ttsConfig"
  | "viewUsers"
  | "createUsers"
  | "manageUsers"
  | "viewResellers"
  | "createResellers"
  | "manageResellers"
  | "systemSettings"
  | "billingSettings";

export type ComponentKey =
  | "chat_widget"
  | "color_customization"
  | "ai_personality"
  | "voice_mode"
  | "analytics_basic"
  | "analytics_advanced"
  | "white_label"
  | "api_access"
  | "webhook_integration"
  | "stt_advanced"
  | "tts_premium";

export type AllowedFeatures = Record<FeatureKey, boolean>;

export interface UserLimits {
  maxUsers: number;
  maxFlows: number;
  maxApiCalls: number;
  storageLimit: number;
}

export interface UserUsage {
  currentUsers: number;
  currentFlows: number;
  currentApiCalls: number;
  storageUsed: number;
}

export interface SidebarConfig {
  topIcon: "voxio" | "custom" | "company";
  customIcon?: string;
  visibleMenuItems: string[];
  menuOrder: string[];
  collapsedSections?: string[];
}

export interface ABACUser {
  id: string;
  role: Role;
  allowedFeatures: AllowedFeatures;
  allowedComponents: ComponentKey[];
  limits?: UserLimits;
  usage?: UserUsage;
  createdBy?: string;
  parentReseller?: string;
  sidebarConfig?: SidebarConfig;
}

export interface ABACResource {
  id?: string;
  ownerId?: string;
  userId?: string;
  resellerId?: string;
  createdBy?: string;
  parentReseller?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  permission?: Permission;
  feature?: FeatureKey;
  component?: ComponentKey;
  roles?: Role[];
}

export type LimitKey = keyof UserLimits;
