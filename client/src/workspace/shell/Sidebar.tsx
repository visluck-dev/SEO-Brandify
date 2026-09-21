import { Link, useLocation } from "wouter";

import { Logo } from "@/components/Logo";
import { useWorkspace } from "../data/WorkspaceContext";
import { cn } from "@/lib/utils";
import { ConsultantCard } from "./ConsultantCard";
import { isNavActive, NAV } from "./nav";

/** Desktop navigation. Counts come from derived state so they are always current. */
export function Sidebar({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const [location] = useLocation();
  const { state } = useWorkspace();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="px-5 pb-4 pt-5">
        <Logo />
      </div>
      <nav aria-label="Workspace" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = isNavActive(item.href, location);
            const count = item.badge?.(state) ?? 0;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-lg px-3 font-display text-sm font-semibold transition-colors duration-150 hover:bg-mist",
                    active ? "bg-teal-50 text-teal-700" : "text-body",
                  )}
                >
                  <item.icon className={cn("size-[18px] shrink-0", active ? "text-teal-700" : "text-muted-foreground")} aria-hidden="true" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {count > 0 && (
                    <span className={cn("tabular rounded-full px-1.5 text-[0.6875rem] font-bold leading-5", active ? "bg-teal-100 text-teal-700" : "bg-fog text-body")}>
                      {count}
                      <span className="sr-only"> waiting</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3">
        <ConsultantCard compact />
      </div>
    </div>
  );
}
