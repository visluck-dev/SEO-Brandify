import { Check, Flag } from "lucide-react";

import { fmtWc } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { PageHeader } from "../shell/PageHeader";
import { cn } from "@/lib/utils";

/** The week-by-week plan agreed on the kick-off call, with where the search is today. */
export default function PlanPage() {
  const { state } = useWorkspace();
  const milestoneDone = (title?: string) => !!title && state.milestones.some((m) => m.title.toLowerCase().includes(title.toLowerCase().split(" ")[0]));

  return (
    <div>
      <PageHeader
        title="Your search plan"
        description={`Eight weeks, agreed with Daniel on the kick-off call. Each week has one focus and one milestone; the plan flexes when the market does, and every change is logged.`}
      />
      <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-[1.1875rem] before:top-6 before:w-px before:bg-hairline">
        {state.plan.map((w) => {
          const done = w.status === "done";
          const current = w.status === "current";
          return (
            <li key={w.week} className="relative flex gap-4">
              <span
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold",
                  done ? "border-teal-600 bg-teal-600 text-white" : current ? "border-ink bg-ink text-white" : "border-hairline bg-white text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : w.week}
              </span>
              <div className={cn("flex-1 rounded-2xl border bg-white p-4 sm:p-5", current ? "border-ink shadow-card" : "border-hairline")}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-ink">
                    Week {w.week} — {w.title}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {fmtWc(w.startsOn)}
                    {current && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">This week</span>}
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{w.focus}</p>
                {w.milestone && (
                  <p className="mt-3 flex items-center gap-2 text-sm">
                    <Flag className={cn("size-4", done || milestoneDone(w.milestone) ? "text-teal-700" : "text-muted-foreground")} aria-hidden="true" />
                    <span className={cn("font-semibold", done ? "text-teal-700" : "text-ink")}>{w.milestone}</span>
                    {done && <span className="text-xs text-muted-foreground">· reached</span>}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
