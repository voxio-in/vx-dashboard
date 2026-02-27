// packages/shared/src/constants/ui-registry.ts
// Single source of truth for ALL configurable UI component IDs.
// SuperAdmin uses these IDs to show/hide elements per-role or per-user.
// Convention: "section:subsection:element" using colons throughout.

export const UI_REGISTRY = {
  // ─── SIDEBAR ──────────────────────────────────────────────
  SIDEBAR_DASHBOARD: "sidebar:dashboard",
  SIDEBAR_ADMINS: "sidebar:admins",
  SIDEBAR_RESELLERS: "sidebar:resellers",
  SIDEBAR_ALL_USERS: "sidebar:all_users",
  SIDEBAR_USERS: "sidebar:users",
  SIDEBAR_MY_USERS: "sidebar:my_users",
  SIDEBAR_FLOWS: "sidebar:flows",
  SIDEBAR_SESSIONS: "sidebar:sessions",
  SIDEBAR_UI_CONFIG: "sidebar:ui_config",
  SIDEBAR_ANALYTICS: "sidebar:analytics",
  SIDEBAR_SETTINGS: "sidebar:settings",

  // ─── HEADER ───────────────────────────────────────────────
  HEADER_THEME_TOGGLE: "header:theme_toggle",
  HEADER_NOTIFICATIONS: "header:notifications",
  HEADER_USER_MENU: "header:user_menu",

  // ─── DASHBOARD ────────────────────────────────────────────
  DASHBOARD_TOTAL_ADMINS: "dashboard:total_admins",
  DASHBOARD_TOTAL_RESELLERS: "dashboard:total_resellers",
  DASHBOARD_TOTAL_USERS: "dashboard:total_users",
  DASHBOARD_TOTAL_FLOWS: "dashboard:total_flows",
  DASHBOARD_TOTAL_SESSIONS: "dashboard:total_sessions",
  DASHBOARD_ACTIVITY_LOG: "dashboard:activity_log",
  DASHBOARD_HERO_CHART: "dashboard:hero_chart",
  DASHBOARD_DATE_FILTER: "dashboard:date_filter",

  // ─── USER MANAGEMENT ──────────────────────────────────────
  USER_TABLE: "user:table",
  USER_SEARCH_BAR: "user:search_bar",
  USER_CREATE_BUTTON: "user:create_button",
  USER_EDIT_BUTTON: "user:edit_button",
  USER_DELETE_BUTTON: "user:delete_button",
  USER_TOGGLE_BUTTON: "user:toggle_button",
  USER_PERMISSIONS_TAB: "user:permissions_tab",
  USER_UI_CONFIG_TAB: "user:ui_config_tab",
  USER_ROLE_BADGE: "user:role_badge",

  // ─── FLOWS — List (/reseller/flows) ───────────────────────
  FLOW_LIST: "flow:list",
  FLOW_SEARCH_BAR: "flow:search_bar",
  FLOW_CREATE_BUTTON: "flow:create_button",
  FLOW_RENAME_BUTTON: "flow:rename_button",
  FLOW_DELETE_BUTTON: "flow:delete_button",
  FLOW_STATUS_BADGE: "flow:status_badge",
  FLOW_API_KEY: "flow:api_key",

  // ─── FLOW HUB — Config (/reseller/flows/:flowId) ──────────
  FLOW_STT_CARD: "flow:hub:card:stt",
  FLOW_AGENT_CARD: "flow:hub:card:agent",
  FLOW_TTS_CARD: "flow:hub:card:tts",
  FLOW_SILENCE_CARD: "flow:hub:card:silence",

  // ─── STT — Speech to Text ─────────────────────────────────
  STT_CONFIG_SECTION: "stt:config_section",
  STT_SERVICE_MODEL: "stt:service_model", // provider + model row
  STT_LANGUAGE: "stt:language",
  STT_PROMPT: "stt:prompt", // groq only
  STT_TEMPERATURE: "stt:temperature", // groq only
  STT_KEYTERMS: "stt:keyterms", // deepgram only
  STT_ADVANCED: "stt:advanced", // channels + sample rate
  STT_SAVE_BUTTON: "stt:save_button",

  // ─── TTS — Text to Speech ─────────────────────────────────
  TTS_CONFIG_SECTION: "tts:config_section",
  TTS_SERVICE_MODEL: "tts:service_model", // provider + model row
  TTS_VOICE: "tts:voice", // voice dropdown / manual input
  TTS_FINE_TUNING: "tts:fine_tuning", // stability, similarity, speed
  TTS_SAVE_BUTTON: "tts:save_button",

  // ─── AGENT CONFIG ─────────────────────────────────────────
  AGENT_GREETING: "agent:greeting",
  AGENT_SYSTEM_PROMPT: "agent:system_prompt",
  AGENT_PROVIDER_MODEL: "agent:provider_model",
  AGENT_EMOTION_TOGGLE: "agent:emotion_toggle",
  AGENT_TEST_BUTTON: "agent:test_button",
  AGENT_SAVE_BUTTON: "agent:save_button",

  // RolePlay only
  AGENT_TRAINEE_NAME: "agent:trainee_name",
  AGENT_ROLEPLAY_SECTION: "agent:roleplay_section",
  AGENT_FEEDBACK_SECTION: "agent:feedback_section",
  AGENT_FEEDBACK_PROMPT: "agent:feedback_prompt",
  AGENT_FEEDBACK_MODEL: "agent:feedback_model",
  AGENT_SUMMARY_SECTION: "agent:summary_section",
  AGENT_SUMMARY_PROMPT: "agent:summary_prompt",
  AGENT_SUMMARY_MODEL: "agent:summary_model",

  // ─── SESSIONS ─────────────────────────────────────────────
  SESSION_LIST: "session:list",
  SESSION_TRANSCRIPT: "session:transcript",
  SESSION_FEEDBACK_VIEW: "session:feedback_view",
  SESSION_SUMMARY_VIEW: "session:summary_view",
  SESSION_DELETE_BUTTON: "session:delete_button",
  SESSION_EXPORT_BUTTON: "session:export_button",
  SESSION_DATE_FILTER: "session:date_filter",
  SESSION_DETAIL_VIEW: "session:detail_view",

  // ─── UI CONFIG (SuperAdmin) ───────────────────────────────
  UI_CONFIG_ROLE_TABS: "ui_config:role_tabs",
  UI_CONFIG_USER_OVERRIDES: "ui_config:user_overrides",
  UI_CONFIG_COMPONENT_MATRIX: "ui_config:component_matrix",

  // ─── SUPERADMIN ───────────────────────────────────────────
  SA_ADMINS_TABLE: "superadmin:admins:table",
  SA_ADMINS_CREATE: "superadmin:admins:create_button",
  SA_ADMINS_EDIT: "superadmin:admins:edit_button",
  SA_ADMINS_PERMISSIONS: "superadmin:admins:permissions_button",
  SA_ADMINS_CONFIG: "superadmin:admins:config_button",

  SA_RESELLERS_TABLE: "superadmin:resellers:table",
  SA_RESELLERS_CREATE: "superadmin:resellers:create_button",
  SA_RESELLERS_EDIT: "superadmin:resellers:edit_button",
  SA_RESELLERS_CONFIG: "superadmin:resellers:config_button",
  SA_RESELLERS_USERS: "superadmin:resellers:users_button",

  SA_USERS_TABLE: "superadmin:users:table",
  SA_USERS_CREATE: "superadmin:users:create_button",
  SA_USERS_EDIT: "superadmin:users:edit_button",

  SA_SIDEBAR_CONFIG: "superadmin:sidebar_config",
  SA_GLOBAL_SETTINGS: "superadmin:global_settings",

  // ─── ADMIN ────────────────────────────────────────────────
  ADMIN_RESELLERS_TABLE: "admin:resellers:table",
  ADMIN_RESELLERS_CREATE: "admin:resellers:create_button",
  ADMIN_USERS_TABLE: "admin:users:table",
  ADMIN_FLOWS_TABLE: "admin:flows:table",
  ADMIN_SESSIONS_TABLE: "admin:sessions:table",
} as const;

export type UIComponentId = (typeof UI_REGISTRY)[keyof typeof UI_REGISTRY];
export type UIRegistryKey = keyof typeof UI_REGISTRY;
