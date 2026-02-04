import type {
  AllowedFeatures,
  ComponentKey,
  Role,
  SidebarConfig,
} from "./types";

const DISABLED_FEATURES: AllowedFeatures = {
  dashboard: false,
  services: false,
  analytics: false,
  flows: false,
  createFlow: false,
  deleteFlow: false,
  agentConfig: false,
  sttConfig: false,
  ttsConfig: false,
  viewUsers: false,
  createUsers: false,
  manageUsers: false,
  viewResellers: false,
  createResellers: false,
  manageResellers: false,
  systemSettings: false,
  billingSettings: false,
};

const SUPER_ADMIN_FEATURES: AllowedFeatures = {
  dashboard: true,
  services: true,
  analytics: true,
  flows: true,
  createFlow: true,
  deleteFlow: true,
  agentConfig: true,
  sttConfig: true,
  ttsConfig: true,
  viewUsers: true,
  createUsers: true,
  manageUsers: true,
  viewResellers: true,
  createResellers: true,
  manageResellers: true,
  systemSettings: true,
  billingSettings: true,
};

export const DEFAULT_ALLOWED_FEATURES: Record<Role, AllowedFeatures> = {
  super_admin: SUPER_ADMIN_FEATURES,
  admin: DISABLED_FEATURES,
  reseller: DISABLED_FEATURES,
  user: DISABLED_FEATURES,
};

export const DEFAULT_SIDEBAR_CONFIG: Record<Role, SidebarConfig> = {
  super_admin: {
    topIcon: "voxio",
    visibleMenuItems: [
      "dashboard",
      "services",
      "analytics",
      "flows",
      "agents",
      "stt_config",
      "tts_config",
      "users",
      "resellers",
      "admins",
      "system_settings",
      "billing",
      "api_keys",
      "audit_logs",
    ],
    menuOrder: [
      "dashboard",
      "services",
      "analytics",
      "flows",
      "agents",
      "stt_config",
      "tts_config",
      "users",
      "resellers",
      "admins",
      "system_settings",
      "billing",
      "api_keys",
      "audit_logs",
    ],
    collapsedSections: ["settings"],
  },
  admin: {
    topIcon: "voxio",
    visibleMenuItems: [],
    menuOrder: [],
  },
  reseller: {
    topIcon: "voxio",
    visibleMenuItems: [],
    menuOrder: [],
  },
  user: {
    topIcon: "voxio",
    visibleMenuItems: [],
    menuOrder: [],
  },
};

export const COMPONENT_CATEGORIES: Record<string, ComponentKey[]> = {
  core: ["chat_widget", "color_customization", "ai_personality"],
  analytics: ["analytics_basic", "analytics_advanced"],
  voice: ["voice_mode", "stt_advanced", "tts_premium"],
  platform: ["white_label", "api_access", "webhook_integration"],
};
