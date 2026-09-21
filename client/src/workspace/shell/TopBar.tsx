import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "@/components/Logo";
import { LiveDot } from "@/components/dashboard/DashboardParts";
import { relativeTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";
import { currentNavLabel } from "./nav";
import { Sidebar } from "./Sidebar";

/** Slim bar above the content: section name, last update, unread activity, the candidate. */
export function TopBar({ className }: { className?: string }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { state } = useWorkspace();
  const lastUpdate = state.events[0]?.at ?? state.now;
  const unread = state.sinceLastVisit.total;
  const initials = `${state.candidate.firstName[0]}${state.candidate.lastName[0]}`;

  return (
    <header className={cn("sticky z-40 border-b border-hairline bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80", className)}>
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open workspace menu">
              <Menu className="!size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(20rem,88vw)] border-r-hairline p-0">
            <SheetTitle className="sr-only">Workspace menu</SheetTitle>
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link href={WS.today} className="flex items-center gap-2 rounded-lg lg:hidden" aria-label="Today">
          <LogoMark className="size-7" />
        </Link>

        <h1 className="min-w-0 flex-1 truncate font-display text-sm font-bold text-ink lg:text-base">{currentNavLabel(location)}</h1>

        <p className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <LiveDot />
          Updated {relativeTime(lastUpdate, state.now)}
        </p>

        <Button asChild variant="ghost" size="icon" className="relative" aria-label={unread ? `${unread} updates since your last visit` : "Activity"}>
          <Link href={WS.activity}>
            <Bell className="!size-5" />
            {unread > 0 && (
              <span className="tabular absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-700 px-1 text-[0.625rem] font-bold text-white" aria-hidden="true">
                {unread}
              </span>
            )}
          </Link>
        </Button>

        <Link href={WS.profile} aria-label="Your profile" className="flex size-9 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-white">
          {initials}
        </Link>
      </div>
    </header>
  );
}
