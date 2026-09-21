import {
  Activity,
  CalendarClock,
  Compass,
  FileText,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  NotebookText,
  Send,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { WorkspaceState } from "../data/derive";
import { WS } from "../routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Small count shown next to the label. */
  badge?: (s: WorkspaceState) => number;
  /** Shown in the mobile tab bar. */
  primary?: boolean;
}

export const NAV: readonly NavItem[] = [
  { label: "Today", href: WS.today, icon: LayoutDashboard, primary: true },
  { label: "Applications", href: WS.applications, icon: Send, primary: true },
  { label: "Actions", href: WS.actions, icon: ListChecks, badge: (s) => s.tasks.open.length, primary: true },
  { label: "Interviews", href: WS.interviews, icon: CalendarClock, badge: (s) => s.interviews.upcoming.length, primary: true },
  { label: "Opportunities", href: WS.opportunities, icon: Compass, badge: (s) => s.opportunities.pending.length },
  { label: "Activity", href: WS.activity, icon: Activity },
  { label: "Documents", href: WS.documents, icon: FileText, badge: (s) => s.documents.flatMap((d) => d.versions).filter((v) => v.status === "awaiting-approval").length },
  { label: "Messages", href: WS.messages, icon: MessageSquare },
  { label: "Weekly reports", href: WS.reports, icon: NotebookText },
  { label: "Profile", href: WS.profile, icon: UserRound },
  { label: "Settings", href: WS.settings, icon: Settings },
];

export function isNavActive(href: string, location: string): boolean {
  if (href === "/") return location === "/" || location === "";
  return location === href || location.startsWith(href + "/");
}

export function currentNavLabel(location: string): string {
  return NAV.find((n) => isNavActive(n.href, location))?.label ?? "Workspace";
}
