import { Link } from "wouter";
import { ArrowRight, CalendarClock, Compass, Flag, ListChecks, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { PipelineBar } from "@/components/dashboard/DashboardParts";
import type { Kpi } from "../data/derive";
import { fmtDate, fmtDateLong, fmtDateTime, fmtWc, relativeTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { ActivityList } from "../shell/ActivityList";
import { ConsultantCard } from "../shell/ConsultantCard";
import { EmptyState } from "../shell/EmptyState";
import { InterviewCard } from "../shell/InterviewCard";
import { OpportunityCard } from "../shell/OpportunityCard";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { TaskRow } from "../shell/TaskRow";
import { AlumniToday } from "./AlumniToday";

function greeting(now: string): string {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "numeric", hour12: false }).format(new Date(now)));
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

/** The most important element in the workspace: what moved while you were away. */
function SinceLastVisit() {
  const { state } = useWorkspace();
  const s = state.sinceLastVisit;
  const nextTask = state.tasks.open[0];
  const nextConsultant = state.tasks.consultantOpen[0];
  return (
    <section aria-label="Since your last visit" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3.5 sm:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Since your last visit · {relativeTime(s.since, state.now)}</p>
          {s.total > 0 ? (
            <p className="mt-1 font-display text-base font-bold text-ink sm:text-lg">
              {s.summary.map((x, i) => (
                <span key={x.label}>
                  {i > 0 && <span className="mx-1.5 text-teal-600" aria-hidden="true">·</span>}
                  <span className="tabular">{x.count}</span> {x.label}
                </span>
              ))}
            </p>
          ) : (
            <p className="mt-1 font-display text-base font-bold text-ink sm:text-lg">
              Nothing new yet —{" "}
              {nextTask ? `your next step is "${nextTask.title}"` : nextConsultant ? `Daniel's next step is "${nextConsultant.title}" (${fmtDate(nextConsultant.dueAt)})` : "Daniel is working through this week's plan"}
              .
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 self-start bg-white sm:self-auto">
          <Link href={WS.activity}>
            Activity <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function KpiTile({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-xl border border-hairline bg-white px-4 py-3.5">
      <p className="font-display text-xs font-semibold text-muted-foreground">{kpi.label}</p>
      <p className="tabular mt-1 font-display text-2xl font-extrabold leading-none text-ink">
        <AnimatedNumber value={kpi.value} />
      </p>
      <p className="mt-1.5 truncate text-xs font-medium text-teal-700">{kpi.delta}</p>
    </div>
  );
}

function WeekPlan() {
  const { state } = useWorkspace();
  const week = state.plan.find((w) => w.status === "current") ?? state.plan[state.plan.length - 1];
  return (
    <Panel title={`Week ${week.week} of ${state.plan.length} — ${week.title}`} link={{ href: WS.plan, label: "Full plan" }}>
      <p className="text-sm leading-relaxed text-body">{week.focus}</p>
      {week.milestone && (
        <p className="mt-3 flex items-center gap-2 text-sm">
          <Flag className="size-4 text-teal-700" aria-hidden="true" />
          <span className="text-muted-foreground">Milestone:</span> <span className="font-semibold text-ink">{week.milestone}</span>
        </p>
      )}
      <ol className="mt-4 flex gap-1" aria-label="Plan progress">
        {state.plan.map((w) => (
          <li key={w.week} className="flex-1">
            <span className={`block h-1.5 rounded-full ${w.status === "done" ? "bg-teal-600" : w.status === "current" ? "bg-ink" : "bg-fog"}`} title={`Week ${w.week}: ${w.title}`} />
            <span className="sr-only">
              Week {w.week} {w.status}
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export default function TodayPage() {
  const { state } = useWorkspace();
  const { candidate, tasks, interviews, opportunities, plan } = state;
  if (candidate.status === "placed") return <AlumniToday />;

  const currentWeek = plan.find((w) => w.status === "current");
  const nextWeek = plan.find((w) => w.status === "upcoming");
  const firstApplicationsWeek = plan.find((w) => w.week === 2);
  const openTasks = tasks.open.slice(0, 3);
  const recent = state.events.slice(0, 6);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={`${fmtDateLong(state.now)}${currentWeek ? ` · Week ${currentWeek.week} of ${plan.length}` : ""}`}
        title={`${greeting(state.now)}, ${candidate.firstName}`}
        description={currentWeek ? currentWeek.focus : "Your search plan is complete."}
        className="mb-0"
      />

      <SinceLastVisit />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
        {state.kpis.map((k) => (
          <KpiTile key={k.key} kpi={k} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="space-y-5">
          <Panel title="Your next actions" count={tasks.open.length} link={{ href: WS.actions, label: "All actions" }} bodyClassName="py-1 sm:py-1">
            {openTasks.length ? (
              <ul className="divide-y divide-hairline">
                {openTasks.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={ListChecks}
                compact
                className="my-3"
                title="Nothing waiting on you"
                body={state.tasks.consultantOpen[0] ? `Daniel's next step is "${state.tasks.consultantOpen[0].title}".` : "Daniel is working through this week's plan."}
                when={state.tasks.consultantOpen[0] ? `Due ${fmtDate(state.tasks.consultantOpen[0].dueAt)}` : undefined}
              />
            )}
          </Panel>

          {opportunities.pending.length > 0 && (
            <Panel title="Opportunities for your review" count={opportunities.pending.length} link={{ href: WS.opportunities, label: "All opportunities" }}>
              <div className="grid gap-3 md:grid-cols-2">
                {opportunities.pending.slice(0, 2).map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Upcoming interviews" count={interviews.upcoming.length} link={{ href: WS.interviews, label: "All interviews" }}>
            {interviews.upcoming.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {interviews.upcoming.slice(0, 2).map((i) => (
                  <InterviewCard key={i.id} interview={i} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CalendarClock}
                compact
                title={state.applications.length ? "No interviews booked yet" : "Interviews come after applications"}
                body={
                  state.applications.length
                    ? `${state.kpis[3].value} applications are awaiting a reply and follow-ups are scheduled. Interviews usually follow a shortlist by a week or two.`
                    : `First applications go out ${firstApplicationsWeek ? fmtWc(firstApplicationsWeek.startsOn) : "next week"} once you approve the roles. Every interview gets a prep kit here.`
                }
                when={state.applications.length ? undefined : firstApplicationsWeek ? `Expected ${fmtWc(firstApplicationsWeek.startsOn)}` : undefined}
              />
            )}
          </Panel>

          <Panel title="Recent activity" link={{ href: WS.activity, label: "Everything" }} bodyClassName="py-1 sm:py-1">
            <ActivityList events={recent} groupByDay={false} markNew />
          </Panel>
        </div>

        <div className="space-y-5">
          <ConsultantCard />
          <WeekPlan />

          {opportunities.pending.length === 0 && candidate.preferences.approvalMode === "approve-first" && (
            <Panel title="Opportunities">
              <EmptyState
                icon={Compass}
                compact
                title="Nothing waiting for your approval"
                body="Daniel is researching roles against your targets. New opportunities usually appear within 48 hours and wait here for your OK."
                when={nextWeek ? `More expected ${fmtWc(nextWeek.startsOn)}` : undefined}
              />
            </Panel>
          )}

          <Panel title="Pipeline">
            {state.applications.length ? (
              <PipelineBar stages={state.pipeline} />
            ) : (
              <p className="text-sm leading-relaxed text-body">
                Applied → Shortlisted → Interview → Offer. The funnel fills from {firstApplicationsWeek ? fmtWc(firstApplicationsWeek.startsOn) : "next week"}; every stage change shows here the moment Daniel logs it.
              </p>
            )}
          </Panel>

          {state.milestones.length > 0 && (
            <Panel title="Milestones">
              <ul className="space-y-2.5">
                {state.milestones.slice(0, 4).map((m) => (
                  <li key={m.id} className="flex items-start gap-2.5 text-sm">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden="true" />
                    <span>
                      <span className="font-semibold text-ink">{m.title}</span>
                      <span className="block text-xs text-muted-foreground">{fmtDateTime(m.at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
