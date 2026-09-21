/** Workspace paths, relative to the router base ("/demo" today, "/app" once sign-in exists). */
export const WS = {
  today: "/",
  start: "/start",
  plan: "/plan",
  applications: "/applications",
  application: (id: string) => `/applications/${id}`,
  activity: "/activity",
  actions: "/actions",
  interviews: "/interviews",
  interview: (id: string) => `/interviews/${id}`,
  opportunities: "/opportunities",
  documents: "/documents",
  messages: "/messages",
  reports: "/reports",
  report: (id: string) => `/reports/${id}`,
  profile: "/profile",
  settings: "/settings",
} as const;

export const DEMO_BASE = "/demo";
export const APP_BASE = "/app";
export const OPS_BASE = "/ops";
