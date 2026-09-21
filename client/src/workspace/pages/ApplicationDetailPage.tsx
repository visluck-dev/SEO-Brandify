import { Link } from "wouter";
import { ArrowLeft, ExternalLink, FileText, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fmtDate, fmtDateTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { ActivityList } from "../shell/ActivityList";
import { EmptyState } from "../shell/EmptyState";
import { InterviewCard } from "../shell/InterviewCard";
import { Panel } from "../shell/Panel";
import { StatusPill } from "../shell/StatusPill";
import { TaskRow } from "../shell/TaskRow";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}

export default function ApplicationDetailPage({ id }: { id: string }) {
  const { state } = useWorkspace();
  const a = state.applications.find((x) => x.id === id);

  if (!a) {
    return (
      <EmptyState
        title="We could not find that application"
        body="It may belong to a different moment in the sample search. Every application you approve appears in the list."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href={WS.applications}>
              <ArrowLeft aria-hidden="true" /> Applications
            </Link>
          </Button>
        }
      />
    );
  }

  const interviews = state.interviews.all.filter((i) => i.applicationId === a.id);
  const nextTask = a.nextAction ? state.tasks.open.find((t) => t.id === a.nextAction!.taskId) ?? state.tasks.consultantOpen.find((t) => t.id === a.nextAction!.taskId) : undefined;
  const timeline = a.events.slice().reverse();
  const appliedDaysAgo = Math.round((new Date(state.now).getTime() - new Date(a.sentAt).getTime()) / 86_400_000);

  return (
    <div>
      <Link href={WS.applications} className="mb-4 inline-flex items-center gap-1.5 rounded-md font-display text-sm font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> Applications
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-[1.75rem]">{a.company}</h2>
            <StatusPill tone={a.tone} label={a.statusLabel} />
          </div>
          <p className="mt-1 text-base text-body">{a.role}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {a.location} · {a.workMode} · via {a.source}
            {a.salaryRange ? ` · ${a.salaryRange}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {a.jobUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={a.jobUrl} target="_blank" rel="noreferrer">
                Job advert <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`${WS.messages}?about=${a.id}`}>
              <MessageSquare aria-hidden="true" /> Ask Daniel
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="space-y-5">
          {a.stageNote && (
            <p className="rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-body">
              <span className="font-semibold text-ink">Latest: </span>
              {a.stageNote} <span className="text-muted-foreground">· {fmtDate(a.stageAt)}</span>
            </p>
          )}

          <Panel title="Next step">
            {nextTask ? (
              <ul>
                <TaskRow task={nextTask} showApplication={false} />
              </ul>
            ) : a.stage === "closed" ? (
              <p className="text-sm text-body">This application is closed. The record stays here so nothing is lost for the next search.</p>
            ) : (
              <p className="text-sm text-body">Nothing scheduled right now — Daniel is waiting on the employer and will log the next follow-up date here.</p>
            )}
          </Panel>

          {interviews.length > 0 && (
            <Panel title="Interviews" count={interviews.length}>
              <div className="grid gap-3">
                {interviews.map((i) => (
                  <InterviewCard key={i.id} interview={i} compact />
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Timeline" count={timeline.length} bodyClassName="py-1 sm:py-1">
            <ActivityList events={timeline} groupByDay={false} showApplication={false} />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Details">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Applied">
                {fmtDateTime(a.sentAt)} <span className="text-muted-foreground">· {appliedDaysAgo} days ago</span>
              </Detail>
              <Detail label="Stage since">{fmtDate(a.stageAt)}</Detail>
              <Detail label="Recruiter">{a.recruiter ? `${a.recruiter.name} · ${a.recruiter.org}` : "In-house team"}</Detail>
              <Detail label="Source">{a.source}</Detail>
              <Detail label="CV version used">
                {a.cvVersion ? (
                  <Link href={WS.documents} className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:underline">
                    <FileText className="size-4" aria-hidden="true" /> CV v{a.cvVersion.version}
                  </Link>
                ) : (
                  "—"
                )}
              </Detail>
              <Detail label="Salary range">{a.salaryRange ?? "Not advertised"}</Detail>
            </dl>
            {a.coverNote && (
              <p className="mt-4 rounded-lg bg-mist px-3 py-2.5 text-sm text-body">
                <span className="font-semibold text-ink">Supporting statement: </span>
                {a.coverNote}
              </p>
            )}
          </Panel>

          {a.notes.length > 0 && (
            <Panel title="Notes">
              <ul className="space-y-3">
                {a.notes.map((n) => (
                  <li key={n.at} className="text-sm text-body">
                    {n.body}
                    <span className="block text-xs text-muted-foreground">
                      {n.by === "consultant" ? "Daniel" : "You"} · {fmtDate(n.at)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title="Stage history">
            <ol className="space-y-2">
              {a.history.map((h, i) => (
                <li key={h.at} className="flex items-start gap-3 text-sm">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${i === a.history.length - 1 ? "bg-teal-600" : "bg-hairline-strong"}`} aria-hidden="true" />
                  <span>
                    <span className="font-semibold capitalize text-ink">{h.stage}</span>
                    <span className="text-muted-foreground"> · {fmtDateTime(h.at)}</span>
                    {h.note && <span className="block text-body">{h.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}
