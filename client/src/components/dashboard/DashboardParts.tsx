import { CalendarClock, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/constants/dashboard";
import { cn } from "@/lib/utils";

export function LiveDot() {
  return (
    <span className="relative flex size-2" aria-hidden="true">
      <span className="absolute inline-flex size-full rounded-full bg-teal-500 animate-pulse-ring" />
      <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
    </span>
  );
}

export function KpiTile({ label, value, delta, compact }: { label: string; value: number; delta: string; compact?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-hairline bg-white", compact ? "px-3 py-2.5" : "px-4 py-3.5")}>
      <p className={cn("font-display font-semibold text-muted-foreground", compact ? "text-[0.6875rem]" : "text-xs")}>{label}</p>
      <p className={cn("tabular mt-1 font-display font-extrabold leading-none text-ink", compact ? "text-xl" : "text-2xl")}>{value}</p>
      <p className={cn("mt-1.5 font-medium text-teal-700", compact ? "text-[0.6875rem]" : "text-xs")}>{delta}</p>
    </div>
  );
}

export function StatusPill({ status, label }: { status: ApplicationStatus; label: string }) {
  return (
    <Badge variant={status} className="px-2 py-0 text-[0.6875rem]">
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </Badge>
  );
}

export function PipelineBar({ stages }: { stages: readonly { stage: string; count: number }[] }) {
  const max = stages[0]?.count ?? 1;
  return (
    <div>
      <p className="font-display text-xs font-semibold text-muted-foreground">Pipeline</p>
      <ul className="mt-2.5 space-y-2">
        {stages.map((s) => (
          <li key={s.stage} className="grid grid-cols-[4.75rem_1fr_1.5rem] items-center gap-2 text-xs">
            <span className="truncate font-medium text-body">{s.stage}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-fog" aria-hidden="true">
              <span className="block h-full rounded-full bg-teal-600" style={{ width: `${Math.max(8, (s.count / max) * 100)}%` }} />
            </span>
            <span className="tabular text-right font-semibold text-ink">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NextActions({ items }: { items: readonly { title: string; when: string }[] }) {
  return (
    <div>
      <p className="font-display text-xs font-semibold text-muted-foreground">Next actions</p>
      <ul className="mt-2.5 divide-y divide-hairline">
        {items.map((a) => (
          <li key={a.title} className="flex items-start gap-2.5 py-2 text-xs">
            <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-teal-600" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-ink">{a.title}</span>
              <span className="text-muted-foreground">{a.when}</span>
            </span>
            <ChevronRight className="size-3.5 shrink-0 text-hairline-strong" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}
