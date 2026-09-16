import { BellRing } from "lucide-react";

import { LogoMark } from "@/components/Logo";
import { DASHBOARD_SAMPLE } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import { KpiTile, LiveDot, NextActions, PipelineBar, StatusPill } from "./DashboardParts";

interface DashboardMockProps {
  /** Hero variant: tighter tiles, fewer rows/columns, no side panel below lg. */
  compact?: boolean;
  /** Shows the delayed "Interview scheduled" toast hanging off the panel. */
  withToast?: boolean;
  className?: string;
}

export function DashboardMock({ compact = false, withToast = false, className }: DashboardMockProps) {
  const d = DASHBOARD_SAMPLE;
  const rows = compact ? d.applications.slice(0, 4) : d.applications;

  return (
    <figure className={cn("relative", className)}>
      <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-dashboard">
        {/* Window chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-hairline bg-mist px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <LogoMark className="size-6 shrink-0" />
            <span className="truncate font-display text-sm font-bold text-ink">Candidate Dashboard</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">· {d.week}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
              <LiveDot /> Live
            </span>
            <span
              className="flex size-7 items-center justify-center rounded-full bg-navy-100 font-display text-[0.65rem] font-bold text-ink"
              aria-label={`Signed in as ${d.candidate}`}
            >
              {d.candidate.split(" ").map((p) => p[0]).join("")}
            </span>
          </div>
        </div>

        <div className={cn("space-y-4 p-4", compact ? "sm:p-4" : "sm:p-5")}>
          {/* KPI tiles */}
          <div className={cn("grid gap-2.5", compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5")}>
            {d.kpis.map((k, i) => (
              <div key={k.key} className={cn(i === 4 && "col-span-2 sm:col-span-1")}>
                <KpiTile label={k.label} value={k.value} delta={k.delta} compact={compact} />
              </div>
            ))}
          </div>

          <div className={cn("grid gap-4", compact ? "xl:grid-cols-[1fr_11.5rem]" : "lg:grid-cols-[1fr_13rem]")}>
            {/* Applications table */}
            <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-hairline">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">Recent applications with status, recruiter, interview date and next action</caption>
                <thead className="bg-fog font-display text-[0.6875rem] font-semibold text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-2.5 py-2">Company / Role</th>
                    <th scope="col" className="hidden px-2.5 py-2 md:table-cell">Applied</th>
                    <th scope="col" className="px-2.5 py-2">Status</th>
                    <th scope="col" className={cn("px-2.5 py-2", compact ? "hidden" : "hidden md:table-cell")}>Recruiter</th>
                    <th scope="col" className={cn("px-2.5 py-2", compact ? "hidden 2xl:table-cell" : "hidden sm:table-cell")}>Interview</th>
                    <th scope="col" className={cn("px-2.5 py-2", compact ? "hidden" : "hidden lg:table-cell")}>Next action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {rows.map((r, i) => (
                    <tr key={r.company} className={cn(compact && i > 1 && "hidden sm:table-row")}>
                      <td className="px-2.5 py-2.5">
                        <span className="block truncate font-semibold text-ink">{r.company}</span>
                        <span className="block truncate text-muted-foreground">{r.role}</span>
                      </td>
                      <td className="tabular hidden px-2.5 py-2.5 text-body md:table-cell">{r.applied}</td>
                      <td className="px-2.5 py-2.5"><StatusPill status={r.status} label={r.statusLabel} /></td>
                      <td className={cn("px-2.5 py-2.5 text-body", compact ? "hidden" : "hidden md:table-cell")}>{r.recruiter}</td>
                      <td className={cn("tabular px-2.5 py-2.5 text-body", compact ? "hidden 2xl:table-cell" : "hidden sm:table-cell")}>{r.interview}</td>
                      <td className={cn("px-2.5 py-2.5 text-body", compact ? "hidden" : "hidden lg:table-cell")}>{r.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Side panel */}
            <aside className={cn("space-y-4 rounded-xl border border-hairline bg-mist/60 p-3.5", compact ? "hidden xl:block" : "hidden lg:block")}>
              <PipelineBar stages={d.pipeline} />
              <NextActions items={d.nextActions} />
            </aside>
          </div>
        </div>
      </div>

      {withToast && <ScheduledToast />}

      <figcaption className="mt-3 text-center text-xs text-muted-foreground">{d.caption}</figcaption>
    </figure>
  );
}

/** Static notification card hanging off the panel (no mount animation, per ui-animation review). */
function ScheduledToast() {
  const t = DASHBOARD_SAMPLE.toast;
  return (
    <div className="absolute -bottom-3 left-3 hidden sm:block lg:-left-8 lg:bottom-4">
      <div className="flex items-center gap-3 rounded-xl border border-hairline bg-white px-3.5 py-2.5 shadow-toast">
        <span className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <BellRing className="size-4" aria-hidden="true" />
        </span>
        <span className="text-xs">
          <span className="block font-display font-bold text-ink">{t.title}</span>
          <span className="text-muted-foreground">{t.detail}</span>
        </span>
      </div>
    </div>
  );
}
