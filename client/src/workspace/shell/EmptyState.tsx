import type { ReactNode } from "react";
import { CalendarClock, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  body: string;
  /** "Expected w/c 21 Sep" — the no-empty-state rule: always say what happens next and when. */
  when?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon: Icon = CalendarClock, title, body, when, action, className, compact }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-start gap-3 rounded-xl border border-dashed border-hairline-strong bg-mist/60", compact ? "p-4" : "p-5 sm:p-6", className)}>
      <span className="flex size-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700" aria-hidden="true">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-display text-base font-bold text-ink">{title}</p>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-body">{body}</p>
      </div>
      {when && <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-display text-xs font-semibold text-teal-700 ring-1 ring-hairline">{when}</p>}
      {action}
    </div>
  );
}
