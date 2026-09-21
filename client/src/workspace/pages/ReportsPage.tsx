import { Link } from "wouter";
import { ArrowLeft, ArrowRight, NotebookText } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WeeklyReport } from "../data/types";
import { fmtDate, fmtDateTime, fmtWeekOf } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { EmptyState } from "../shell/EmptyState";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";

function Numbers({ r }: { r: WeeklyReport }) {
  const items = [
    ["Applications", r.numbers.applications],
    ["Replies", r.numbers.replies],
    ["Interviews", r.numbers.interviews],
    ["Follow-ups", r.numbers.followups],
  ] as const;
  return (
    <dl className="grid grid-cols-4 gap-2">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg bg-mist px-2.5 py-2 text-center">
          <dd className="tabular font-display text-lg font-extrabold text-ink">{v}</dd>
          <dt className="text-[0.6875rem] font-semibold text-muted-foreground">{k}</dt>
        </div>
      ))}
    </dl>
  );
}

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="eyebrow mb-2">{title}</h4>
      <ul className="space-y-2 text-sm leading-relaxed text-body">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReportDetailPage({ id }: { id: string }) {
  const { state } = useWorkspace();
  const r = state.reports.find((x) => x.id === id);
  if (!r) {
    return (
      <EmptyState
        title="That report is not available yet"
        body="Weekly reports are published every Monday at 09:00 for the week just gone."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href={WS.reports}>
              <ArrowLeft aria-hidden="true" /> Weekly reports
            </Link>
          </Button>
        }
      />
    );
  }
  return (
    <div>
      <Link href={WS.reports} className="mb-4 inline-flex items-center gap-1.5 rounded-md font-display text-sm font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> Weekly reports
      </Link>
      <PageHeader eyebrow={`Published ${fmtDateTime(r.publishedAt)}`} title={`Week ${r.week} — ${fmtWeekOf(r.weekStartsOn)}`} description={r.note} />
      <Panel>
        <Numbers r={r} />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Column title="What we did" items={r.did} />
          <Column title="What happened" items={r.happened} />
          <Column title="What's next" items={r.next} />
        </div>
      </Panel>
    </div>
  );
}

export default function ReportsPage() {
  const { state } = useWorkspace();
  const reports = state.reports;
  const nextMonday = state.plan.find((w) => w.status === "upcoming")?.startsOn;

  return (
    <div>
      <PageHeader title="Weekly reports" description="Every Monday at 09:00: what we did, what happened, what's next — drafted from the activity log and checked by Daniel. Also sent by email." />
      {reports.length === 0 ? (
        <EmptyState
          icon={NotebookText}
          title="Your first report arrives on Monday"
          body="It covers this week's positioning work — the CV rebuild, your approved targets and the first opportunities lined up."
          when={nextMonday ? `Monday ${fmtDate(nextMonday)} 09:00` : "Monday 09:00"}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r) => (
            <article key={r.id} className="rounded-2xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-xs font-semibold text-muted-foreground">{fmtDateTime(r.publishedAt)}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">
                Week {r.week} — {fmtWeekOf(r.weekStartsOn)}
              </h3>
              <div className="mt-3">
                <Numbers r={r} />
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-body">
                {r.happened.slice(0, 2).map((h) => (
                  <li key={h} className="truncate">· {h}</li>
                ))}
              </ul>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link href={WS.report(r.id)}>
                  Read the report <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
