import { Link } from "wouter";
import { ArrowRight, CalendarPlus, Clock, MapPin, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { InterviewView } from "../data/derive";
import { buildIcs, daysBetween, downloadTextFile, fmtDate, fmtTime, relativeDay } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

export function addInterviewToCalendar(i: InterviewView) {
  downloadTextFile(
    `${i.company.replace(/[^a-z0-9]+/gi, "-")}-interview.ics`,
    buildIcs({
      uid: i.id,
      title: `Interview — ${i.company} (${i.stageLabel})`,
      start: i.at,
      durationMinutes: i.durationMinutes,
      where: i.where,
      description: `${i.role}. Interviewers: ${i.interviewers.join(", ")}. Prep kit: visluck.com`,
    }),
  );
}

export function InterviewCard({ interview: i, compact = false, className }: { interview: InterviewView; compact?: boolean; className?: string }) {
  const { state } = useWorkspace();
  const days = daysBetween(state.now, i.at);
  const when = i.isPast ? `Completed ${relativeDay(i.at, state.now)}` : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;
  const Where = i.format === "In person" ? MapPin : Video;

  return (
    <article className={cn("rounded-xl border border-hairline bg-white", compact ? "p-3.5" : "p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("font-display font-bold text-ink", compact ? "text-sm" : "text-base")}>{i.company}</p>
          <p className="truncate text-sm text-body">
            {i.role} · {i.stageLabel}
          </p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 font-display text-xs font-bold", i.isPast ? "bg-fog text-body" : days <= 1 ? "bg-teal-700 text-white" : "bg-status-scheduled-tint text-status-scheduled")}>
          {when}
        </span>
      </div>
      <dl className="mt-3 grid gap-1.5 text-sm text-body sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <dd>
            {fmtDate(i.at)}, {fmtTime(i.at)} · {i.durationMinutes} min
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Where className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <dd className="truncate">{i.format === "In person" ? i.where : i.format}</dd>
        </div>
      </dl>
      {!compact && <p className="mt-2 text-sm text-muted-foreground">With {i.interviewers.join(" and ")}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm" variant={i.isPast ? "outline" : "primary"}>
          <Link href={WS.interview(i.id)}>
            {i.isPast ? (i.debrief ? "View" : "Add your debrief") : "Open prep kit"} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        {!i.isPast && (
          <Button size="sm" variant="ghost" onClick={() => addInterviewToCalendar(i)}>
            <CalendarPlus aria-hidden="true" /> Add to calendar
          </Button>
        )}
      </div>
    </article>
  );
}
