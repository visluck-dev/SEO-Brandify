import { CalendarClock } from "lucide-react";

import { fmtWc } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { EmptyState } from "../shell/EmptyState";
import { InterviewCard } from "../shell/InterviewCard";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";

export default function InterviewsPage() {
  const { state } = useWorkspace();
  const { upcoming, past } = state.interviews;
  const firstWeek = state.plan.find((w) => w.week === 2);
  const progressing = state.applications.filter((a) => a.stage === "shortlisted").length;

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Every interview comes with a prep kit — company brief, role brief, likely questions and your STAR bank — and ends with a two-minute debrief that shapes the thank-you note."
      />

      <div className="space-y-5">
        <Panel title="Upcoming" count={upcoming.length}>
          {upcoming.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((i) => (
                <InterviewCard key={i.id} interview={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              icon={CalendarClock}
              title={progressing ? `${progressing} shortlisted — interviews usually follow within a week or two` : state.applications.length ? "No interviews booked yet" : "Interviews come after applications"}
              body={
                state.applications.length
                  ? "The moment an employer offers a slot, Daniel books it, adds the prep kit and asks you to confirm here."
                  : `First applications go out ${firstWeek ? fmtWc(firstWeek.startsOn) : "next week"}. Every interview that follows gets a prep kit in this space.`
              }
              when={state.applications.length ? undefined : firstWeek ? `Applications from ${fmtWc(firstWeek.startsOn)}` : undefined}
            />
          )}
        </Panel>

        {past.length > 0 && (
          <Panel title="Completed" count={past.length}>
            <div className="grid gap-4 md:grid-cols-2">
              {past.map((i) => (
                <InterviewCard key={i.id} interview={i} />
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
