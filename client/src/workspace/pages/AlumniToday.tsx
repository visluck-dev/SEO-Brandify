import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Copy, Gift, HeartHandshake, NotebookText, Send, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { daysBetween, fmtDate, fmtDateLong } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { ConsultantCard } from "../shell/ConsultantCard";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { TaskRow } from "../shell/TaskRow";

const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * 86_400_000).toISOString();

/** Today, after an offer is accepted: the workspace becomes the record of the search and the bridge to the next one. */
export function AlumniToday() {
  const { state } = useWorkspace();
  const { candidate } = state;
  const p = candidate.placement!;
  const startIso = `${p.startsOn}T09:00:00.000Z`;
  const startsIn = daysBetween(state.now, startIso);
  const [warm, setWarm] = useState(true);
  const [copied, setCopied] = useState(false);

  const weeks = Math.max(1, Math.round(daysBetween(candidate.searchStartedAt, p.acceptedAt) / 7));
  const reached = (stages: string[]) => state.applications.filter((a) => a.history.some((h) => stages.includes(h.stage))).length;
  const numbers = [
    { label: "Weeks, kick-off to offer", value: weeks },
    { label: "Applications", value: state.applications.length },
    { label: "Shortlisted", value: reached(["shortlisted", "interview", "offer"]) },
    { label: "Interviews", value: state.interviews.all.length },
    { label: "Offers", value: reached(["offer"]) },
  ];
  const checkIns = [30, 60, 90].map((d) => ({ d, at: addDays(startIso, d) }));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="After placement"
        title={`Congratulations, ${candidate.firstName}`}
        description={
          startsIn > 0
            ? `You start at ${p.company} as ${p.role} on ${fmtDateLong(startIso)} — ${startsIn} ${startsIn === 1 ? "day" : "days"} to go.`
            : `You started at ${p.company} as ${p.role} ${-startsIn === 0 ? "today" : `${-startsIn} days ago`}.`
        }
        className="mb-0"
      />

      <section className="flex flex-col gap-4 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10" aria-hidden="true">
            <Trophy className="size-6 text-teal-100" />
          </span>
          <div>
            <p className="eyebrow-on-navy">Offer accepted · {fmtDate(p.acceptedAt)}</p>
            <p className="mt-1 font-display text-lg font-extrabold">
              {p.role}, {p.company}
            </p>
            <p className="text-sm text-white/70">Nothing is left open in your name — every other application was withdrawn with a thank-you.</p>
          </div>
        </div>
        <Button asChild variant="on-navy" size="sm" className="shrink-0">
          <Link href={WS.application(p.applicationId)}>
            The record <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="space-y-5">
          <Panel title="Before you start" count={state.tasks.open.length} bodyClassName="py-1 sm:py-1">
            {state.tasks.open.length ? (
              <ul className="divide-y divide-hairline">
                {state.tasks.open.map((t) => (
                  <TaskRow key={t.id} task={t} showApplication={false} />
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-body">All done. Daniel will be in touch the week you start.</p>
            )}
          </Panel>

          <Panel title="Your check-ins">
            <p className="text-sm leading-relaxed text-body">Daniel checks in at 30, 60 and 90 days. A one-line reply is enough; a call is there if you want one.</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {checkIns.map((c) => (
                <li key={c.d} className="rounded-xl border border-hairline bg-mist px-4 py-3">
                  <p className="font-display text-sm font-bold text-ink">{c.d}-day check-in</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{fmtDate(c.at)}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Your search in numbers">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {numbers.map((n) => (
                <div key={n.label} className="rounded-xl border border-hairline px-4 py-3">
                  <dt className="text-xs font-semibold text-muted-foreground">{n.label}</dt>
                  <dd className="tabular mt-1 font-display text-2xl font-extrabold text-ink">{n.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-body">
              The full record — every application, reply, interview and weekly report — stays here for 12 months, then is deleted unless you ask us to keep it.{" "}
              <Link href={WS.reports} className="font-medium text-teal-700 hover:underline">
                Weekly reports
              </Link>
            </p>
          </Panel>
        </div>

        <div className="space-y-5">
          <ConsultantCard />

          <Panel title="Keep your profile warm">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={warm} onChange={(e) => setWarm(e.target.checked)} className="mt-1 size-4 accent-teal-700" />
              <span className="text-sm leading-relaxed text-body">
                <span className="font-semibold text-ink">Tell me about the next move in 18 months.</span> Daniel keeps your targets on file and gets in touch — no job alerts in between.
              </span>
            </label>
          </Panel>

          <Panel title="Know someone searching?">
            <p className="text-sm leading-relaxed text-body">Share your link. They get a free consultation; you get to hear how it goes.</p>
            <div className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg border border-hairline bg-mist px-3 py-2 text-xs text-ink">
                visluck.com/r/{candidate.firstName.toLowerCase()}-{candidate.lastName.toLowerCase()}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? (
                  "Copied"
                ) : (
                  <>
                    <Copy aria-hidden="true" /> Copy
                  </>
                )}
              </Button>
            </div>
          </Panel>

          <Panel title="Still here for you">
            <ul className="space-y-3 text-sm text-body">
              <li className="flex gap-2.5">
                <HeartHandshake className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> First-90-days questions — salary review, probation, a difficult stakeholder — go straight to Daniel.
              </li>
              <li className="flex gap-2.5">
                <Send className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> Your CV and LinkedIn stay current: the placement is added the week you start.
              </li>
              <li className="flex gap-2.5">
                <NotebookText className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> Every weekly report is kept, so the next search starts from what worked.
              </li>
              <li className="flex gap-2.5">
                <Gift className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> No upsells, no alerts, no noise — the workspace goes quiet until you need it.
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
