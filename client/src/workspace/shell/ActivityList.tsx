import { Link } from "wouter";
import {
  CalendarClock,
  CalendarPlus,
  CircleCheck,
  Compass,
  Eye,
  FileCheck2,
  FileText,
  Flag,
  Handshake,
  ListChecks,
  MailCheck,
  MessageSquareText,
  NotebookText,
  Reply,
  Send,
  SquarePen,
  Trophy,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import type { ActivityEvent, EventType } from "../data/types";
import { dayHeading, dayKey, fmtDateLong, fmtTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

const ICONS: Record<EventType, { icon: LucideIcon; tone: string }> = {
  "kickoff.completed": { icon: Handshake, tone: "bg-teal-50 text-teal-700" },
  "candidate.onboarded": { icon: UserCog, tone: "bg-teal-50 text-teal-700" },
  "note.added": { icon: SquarePen, tone: "bg-navy-50 text-ink" },
  "opportunity.added": { icon: Compass, tone: "bg-teal-50 text-teal-700" },
  "opportunity.decided": { icon: CircleCheck, tone: "bg-fog text-body" },
  "application.sent": { icon: Send, tone: "bg-teal-50 text-teal-700" },
  "application.viewed": { icon: Eye, tone: "bg-navy-50 text-ink" },
  "followup.sent": { icon: MailCheck, tone: "bg-status-waiting-tint text-status-waiting" },
  "employer.replied": { icon: Reply, tone: "bg-status-progressing-tint text-status-progressing" },
  "stage.changed": { icon: Flag, tone: "bg-status-progressing-tint text-status-progressing" },
  "interview.scheduled": { icon: CalendarPlus, tone: "bg-status-scheduled-tint text-status-scheduled" },
  "interview.completed": { icon: CalendarClock, tone: "bg-status-scheduled-tint text-status-scheduled" },
  "interview.feedback": { icon: Reply, tone: "bg-status-progressing-tint text-status-progressing" },
  "offer.received": { icon: Trophy, tone: "bg-status-progressing-tint text-status-progressing" },
  "offer.accepted": { icon: Trophy, tone: "bg-teal-700 text-white" },
  "document.versioned": { icon: FileText, tone: "bg-navy-50 text-ink" },
  "document.approved": { icon: FileCheck2, tone: "bg-fog text-body" },
  "task.assigned": { icon: ListChecks, tone: "bg-navy-50 text-ink" },
  "task.completed": { icon: CircleCheck, tone: "bg-fog text-body" },
  "message.sent": { icon: MessageSquareText, tone: "bg-fog text-body" },
  "report.published": { icon: NotebookText, tone: "bg-navy-50 text-ink" },
  "preferences.updated": { icon: UserCog, tone: "bg-fog text-body" },
  milestone: { icon: Flag, tone: "bg-teal-700 text-white" },
};

export function EventIcon({ type, className }: { type: EventType; className?: string }) {
  const { icon: Icon, tone } = ICONS[type];
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone, className)} aria-hidden="true">
      <Icon className="size-4" />
    </span>
  );
}

const ACTOR: Record<ActivityEvent["actor"], string> = { consultant: "Daniel", candidate: "You", employer: "Employer", system: "VisLuck" };

interface ActivityItemProps {
  event: ActivityEvent;
  /** Show the related application as a link under the title. */
  showApplication?: boolean;
  /** Highlights events newer than the candidate's last visit. */
  markNew?: boolean;
}

export function ActivityItem({ event, showApplication = true, markNew = false }: ActivityItemProps) {
  const { state } = useWorkspace();
  const app = event.applicationId ? state.applications.find((a) => a.id === event.applicationId) : undefined;
  const isNew = markNew && event.at > state.sinceLastVisit.since && event.actor !== "candidate";
  return (
    <li className="relative flex gap-3 py-3">
      <EventIcon type={event.type} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold text-ink">{event.title}</span>
          {isNew && <span className="rounded-full bg-teal-700 px-1.5 text-[0.625rem] font-bold uppercase leading-4 tracking-wide text-white">New</span>}
        </p>
        {event.detail && <p className="mt-0.5 text-sm leading-relaxed text-body">{event.detail}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          {ACTOR[event.actor]} · {fmtTime(event.at)}
          {showApplication && app && (
            <>
              {" · "}
              <Link href={WS.application(app.id)} className="font-medium text-teal-700 hover:underline">
                {app.company}
              </Link>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

interface ActivityListProps {
  events: ActivityEvent[];
  groupByDay?: boolean;
  showApplication?: boolean;
  markNew?: boolean;
  className?: string;
}

/** Chronological feed (newest first), optionally grouped under day headings. */
export function ActivityList({ events, groupByDay = true, showApplication = true, markNew = false, className }: ActivityListProps) {
  const { state } = useWorkspace();
  if (!groupByDay) {
    return (
      <ul className={cn("divide-y divide-hairline", className)}>
        {events.map((e) => (
          <ActivityItem key={e.id} event={e} showApplication={showApplication} markNew={markNew} />
        ))}
      </ul>
    );
  }
  const groups = new Map<string, ActivityEvent[]>();
  for (const e of events) {
    const k = dayKey(e.at);
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from(groups.entries()).map(([k, items]) => (
        <section key={k} aria-label={fmtDateLong(items[0].at)}>
          <h4 className="sticky top-24 z-10 -mx-1 mb-1 inline-flex rounded-full bg-mist px-2.5 py-0.5 font-display text-xs font-bold text-body ring-1 ring-hairline lg:top-[6.5rem]">
            {(() => {
              const h = dayHeading(items[0].at, state.now);
              return h.relative ? (
                <>
                  {h.relative}
                  <span className="ml-1.5 font-medium text-muted-foreground">{h.long}</span>
                </>
              ) : (
                h.long
              );
            })()}
          </h4>
          <ul className="divide-y divide-hairline">
            {items.map((e) => (
              <ActivityItem key={e.id} event={e} showApplication={showApplication} markNew={markNew} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
