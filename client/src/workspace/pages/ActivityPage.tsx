import { useMemo, useState } from "react";
import { Activity } from "lucide-react";

import type { EventType } from "../data/types";
import { relativeTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { ActivityList } from "../shell/ActivityList";
import { EmptyState } from "../shell/EmptyState";
import { PageHeader } from "../shell/PageHeader";
import { cn } from "@/lib/utils";

type FilterId = "all" | "new" | "applications" | "replies" | "interviews" | "documents" | "yours";

const FILTERS: { id: FilterId; label: string; types?: EventType[]; actor?: "candidate" }[] = [
  { id: "all", label: "Everything" },
  { id: "new", label: "Since your last visit" },
  { id: "applications", label: "Applications & follow-ups", types: ["application.sent", "application.viewed", "followup.sent", "stage.changed", "opportunity.added"] },
  { id: "replies", label: "Employer replies", types: ["employer.replied", "interview.feedback", "offer.received"] },
  { id: "interviews", label: "Interviews", types: ["interview.scheduled", "interview.completed", "interview.feedback"] },
  { id: "documents", label: "Documents & notes", types: ["document.versioned", "document.approved", "note.added", "report.published"] },
  { id: "yours", label: "Your actions", actor: "candidate" },
];

export default function ActivityPage() {
  const { state } = useWorkspace();
  const [filter, setFilter] = useState<FilterId>("all");

  const events = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!;
    if (f.id === "new") return state.sinceLastVisit.events;
    if (f.types) return state.events.filter((e) => f.types!.includes(e.type));
    if (f.actor) return state.events.filter((e) => e.actor === f.actor);
    return state.events;
  }, [state, filter]);

  return (
    <div>
      <PageHeader
        title="Activity"
        description={`Everything done for you, in order, as it was logged. Nothing is edited after the fact — corrections are added as new entries. Last visit ${relativeTime(state.sinceLastVisit.since, state.now)}.`}
      />

      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter activity">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const count = f.id === "new" ? state.sinceLastVisit.total : undefined;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 font-display text-xs font-semibold transition-colors duration-150",
                active ? "border-ink bg-ink text-white" : "border-hairline bg-white text-body hover:bg-mist",
              )}
            >
              {f.label}
              {typeof count === "number" && <span className={cn("tabular", active ? "text-white/70" : "text-muted-foreground")}>{count}</span>}
            </button>
          );
        })}
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={filter === "new" ? "Nothing new since your last visit" : "Nothing here yet"}
          body={filter === "new" ? "The next update lands the moment Daniel logs it — at least one entry every 48 hours while your search is active." : "Entries appear here as soon as they happen."}
        />
      ) : (
        <div className="rounded-2xl border border-hairline bg-white p-4 shadow-card sm:p-5">
          <ActivityList events={events} markNew />
        </div>
      )}
    </div>
  );
}
