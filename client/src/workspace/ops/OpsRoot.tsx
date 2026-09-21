import { Link, Route, Router, Switch, useLocation } from "wouter";
import { LogOut, NotebookText, Users } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Logo } from "@/components/Logo";
import { OPS_BASE } from "../routes";
import { cn } from "@/lib/utils";
import { CandidateBoard } from "./CandidateBoard";
import { CandidateDetail } from "./CandidateDetail";
import { OpsProvider } from "./OpsContext";
import { ReportComposer } from "./ReportComposer";

const NAV = [
  { label: "Candidates", href: "/", icon: Users },
  { label: "Weekly reports", href: "/reports", icon: NotebookText },
];

function OpsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="min-h-[100dvh] bg-mist">
      <div className="sticky top-0 z-50 h-9 bg-status-waiting text-white">
        <p className="mx-auto flex h-full max-w-[1400px] items-center gap-2 truncate px-4 text-xs font-semibold">
          <span className="size-1.5 shrink-0 rounded-full bg-white" aria-hidden="true" />
          <span className="truncate">Consultant console — clickable wireframe on sample data. Everything logged here appears instantly in the candidate's workspace.</span>
        </p>
      </div>
      <header className="sticky top-9 z-40 border-b border-hairline bg-white">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 rounded-lg">
            <Logo />
            <span className="hidden rounded-md bg-navy-50 px-2 py-0.5 font-display text-[0.6875rem] font-bold uppercase tracking-wide text-ink sm:inline">Ops</span>
          </Link>
          <nav aria-label="Console" className="ml-2 flex items-center gap-1">
            {NAV.map((n) => {
              const active = n.href === "/" ? location === "/" || location.startsWith("/candidates") : location.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={cn("inline-flex h-9 items-center gap-2 rounded-lg px-3 font-display text-sm font-semibold", active ? "bg-teal-50 text-teal-700" : "text-body hover:bg-mist")}>
                  <n.icon className="size-4" aria-hidden="true" /> <span className="hidden sm:inline">{n.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">Signed in as Daniel Mercer (sample)</span>
            <Link href="~/" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-body hover:bg-mist">
              <LogOut className="size-4" aria-hidden="true" /> Exit
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}

export default function OpsRoot() {
  return (
    <Router base={OPS_BASE}>
      <SEO title="Consultant console (wireframe) | VisLuck" description="Internal consultant console wireframe." noindex />
      <OpsProvider>
        <OpsShell>
          <Switch>
            <Route path="/" component={CandidateBoard} />
            <Route path="/candidates/:id">{(p) => <CandidateDetail id={p.id} />}</Route>
            <Route path="/reports" component={ReportComposer} />
            <Route component={CandidateBoard} />
          </Switch>
        </OpsShell>
      </OpsProvider>
    </Router>
  );
}
