import { AnimatePresence, motion } from "framer-motion";
import { BellRing } from "lucide-react";

import { LogoMark } from "@/components/Logo";
import { DASHBOARD_SAMPLE } from "@/constants/dashboard";
import type { StoryState } from "@/constants/dashboard-story";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./AnimatedNumber";
import { LiveDot, NextActions, PipelineBar, StatusPill } from "./DashboardParts";

const EASE = [0.22, 1, 0.36, 1] as const;
const ROW_COLS = "grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:grid-cols-[minmax(0,1.7fr)_4.25rem_minmax(0,1.1fr)]";

/** The animated hero dashboard: rows, KPIs and the notification card follow `state`. */
export function LiveDashboardPanel({ state, scene }: { state: StoryState; scene: number }) {
  const rows = state.rows.slice(0, 4);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-dashboard">
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-mist px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <LogoMark className="size-6 shrink-0" />
          <span className="truncate font-display text-sm font-bold text-ink">Candidate Dashboard</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">· {DASHBOARD_SAMPLE.week}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
            <LiveDot /> Live
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-navy-100 font-display text-[0.65rem] font-bold text-ink" aria-label={`Signed in as ${DASHBOARD_SAMPLE.candidate}`}>
            {DASHBOARD_SAMPLE.candidate.split(" ").map((p) => p[0]).join("")}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {state.kpis.map((k, i) => (
            <div key={k.key} className={cn("rounded-xl border border-hairline bg-white px-3 py-2.5", i === 4 && "col-span-2 sm:col-span-1")}>
              <p className="font-display text-[0.6875rem] font-semibold text-muted-foreground">{k.label}</p>
              <p className="tabular mt-1 font-display text-xl font-extrabold leading-none text-ink">
                <AnimatedNumber value={k.value} />
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={k.delta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-1.5 text-[0.6875rem] font-medium text-teal-700">
                  {k.delta}
                </motion.p>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_11.5rem]">
          <div role="table" aria-label="Recent applications" className="flex flex-col overflow-hidden rounded-xl border border-hairline text-xs">
            <div role="row" className={cn("grid bg-fog px-2.5 py-2 font-display text-[0.6875rem] font-semibold text-muted-foreground", ROW_COLS)}>
              <span role="columnheader">Company / Role</span>
              <span role="columnheader" className="hidden md:block">Applied</span>
              <span role="columnheader">Status</span>
            </div>
            <AnimatePresence initial={false}>
              {rows.map((r, i) => (
                <motion.div
                  role="row"
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn("grid items-center border-t border-hairline px-2.5 py-2.5", ROW_COLS, i > 1 && "hidden sm:grid", r.id === state.changedRowId && "row-flash")}
                >
                  <span role="cell" className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{r.company}</span>
                    <span className="block truncate text-muted-foreground">{r.role}</span>
                  </span>
                  <span role="cell" className="tabular hidden text-body md:block">{r.applied}</span>
                  <span role="cell">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={r.status} className="inline-block" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2, ease: EASE }}>
                        <StatusPill status={r.status} label={r.statusLabel} />
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="mt-auto flex items-center justify-end gap-1 border-t border-hairline px-3 py-[1.125rem] text-[0.6875rem] text-muted-foreground">
              Showing <span className="sm:hidden">{Math.min(rows.length, 2)}</span>
              <span className="hidden sm:inline">{rows.length}</span> of <AnimatedNumber value={state.kpis[0].value} /> ·
              <span className="font-semibold text-teal-700">View all</span>
            </div>
          </div>

          <aside className="hidden space-y-4 rounded-xl border border-hairline bg-mist/60 p-3.5 xl:block">
            <PipelineBar stages={state.pipeline} />
            <NextActions items={state.nextActions.slice(0, 3)} />
          </aside>
        </div>
      </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {state.toast && (
          <motion.div
            key={scene}
            className="absolute bottom-3 left-3 hidden sm:block lg:-left-8"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.18 } }}
            transition={{ delay: 0.35, duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-hairline bg-white px-3.5 py-2.5 shadow-toast">
              <span className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <BellRing className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs">
                <span className="block font-display font-bold text-ink">{state.toast.title}</span>
                <span className="text-muted-foreground">{state.toast.detail}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
