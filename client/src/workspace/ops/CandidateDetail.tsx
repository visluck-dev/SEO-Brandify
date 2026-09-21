import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarPlus, ListPlus, NotebookText } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ApplicationView } from "../data/derive";
import type { ApplicationStage, ClosedReason } from "../data/types";
import { fmtDate, fmtDateTime, relativeTime } from "../data/format";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { StatusPill } from "../shell/StatusPill";
import { cn } from "@/lib/utils";
import { AssignTaskSheet } from "./AssignTaskSheet";
import { selectClass } from "./formStyles";
import { useOps } from "./OpsContext";
import { STALE_AFTER_HOURS } from "./OpsStore";
import { QuickLog } from "./QuickLog";
import { ScheduleInterviewSheet } from "./ScheduleInterviewSheet";

const STAGES: { value: ApplicationStage; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "closed", label: "Closed" },
];
const REASONS: { value: ClosedReason; label: string }[] = [
  { value: "no-response", label: "No response" },
  { value: "unsuccessful", label: "Unsuccessful" },
  { value: "role-paused", label: "Role paused" },
  { value: "withdrawn", label: "Withdrawn" },
];
const COLUMNS = ["Company / role", "Sent", "Status", "Stage", "Next", "Log"];

interface RowProps {
  candidateId: string;
  firstName: string;
  a: ApplicationView;
  onSchedule: (appId: string) => void;
}

/** One application row: stage select, close reason, and the three one-click logs. */
function ApplicationRow({ candidateId, firstName, a, onSchedule }: RowProps) {
  const { store } = useOps();
  const [closing, setClosing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [note, setNote] = useState("");

  return (
    <tr className="align-top hover:bg-mist">
      <td className="px-4 py-3">
        <span className="font-display font-bold text-ink">{a.company}</span>
        <span className="block text-xs text-body">{a.role}</span>
      </td>
      <td className="tabular whitespace-nowrap px-4 py-3 text-body">{fmtDate(a.sentAt)}</td>
      <td className="px-4 py-3">
        <StatusPill tone={a.tone} label={a.statusLabel} />
      </td>
      <td className="px-4 py-3">
        {closing ? (
          <select
            autoFocus
            aria-label="Closed reason"
            className={`${selectClass} h-9 w-40`}
            defaultValue=""
            onChange={(e) => {
              if (!e.target.value) return;
              store.updateStage(candidateId, a.id, "closed", undefined, e.target.value as ClosedReason);
              setClosing(false);
            }}
          >
            <option value="" disabled>
              Reason…
            </option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        ) : (
          <select
            aria-label={`Stage for ${a.company}`}
            value={a.stage}
            disabled={a.stage === "closed"}
            className={`${selectClass} h-9 w-36`}
            onChange={(e) => {
              const stage = e.target.value as ApplicationStage;
              if (stage === "closed") setClosing(true);
              else store.updateStage(candidateId, a.id, stage);
            }}
          >
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-body">
        {a.nextAction ? (
          <>
            {a.nextAction.title}
            <span className="block text-muted-foreground">
              {a.nextAction.owner === "candidate" ? firstName : "You"} · {fmtDate(a.nextAction.dueAt)}
            </span>
          </>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3">
        {a.stage !== "closed" && (
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => store.logFollowup(candidateId, a.id)}>
              Follow-up sent
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => setReplying((r) => !r)}>
              Reply received
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => onSchedule(a.id)}>
              Interview
            </Button>
          </div>
        )}
        {replying && (
          <form
            className="mt-2 flex gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              store.logReply(candidateId, a.id, note.trim());
              setNote("");
              setReplying(false);
            }}
          >
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did they say?" aria-label="Employer reply" className="h-8 w-44 rounded-md border border-hairline bg-white px-2 text-xs" />
            <Button type="submit" size="sm" className="h-8 px-2 text-xs">
              Log
            </Button>
          </form>
        )}
      </td>
    </tr>
  );
}

export function CandidateDetail({ id }: { id: string }) {
  const { store } = useOps();
  const state = store.state(id);
  const [schedule, setSchedule] = useState<{ open: boolean; appId?: string }>({ open: false });
  const [assign, setAssign] = useState(false);

  if (!state) {
    return (
      <p className="text-sm text-body">
        Candidate not found.{" "}
        <Link href="/" className="font-semibold text-teal-700">
          Back to the board
        </Link>
      </p>
    );
  }

  const c = state.candidate;
  const lastMove = state.events.find((e) => e.actor !== "candidate");
  const hours = lastMove ? (new Date(state.now).getTime() - new Date(lastMove.at).getTime()) / 3_600_000 : Infinity;
  const stale = hours > STALE_AFTER_HOURS;
  const recent = state.events.slice(0, 12);

  return (
    <div>
      <Link href="/" className="mb-4 inline-flex items-center gap-1.5 rounded-md font-display text-sm font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> Candidates
      </Link>
      <PageHeader
        eyebrow={`Week ${state.currentWeek} · ${store.consultantName(c.consultantId)} · last login ${relativeTime(c.lastSeenAt, state.now)}`}
        title={`${c.firstName} ${c.lastName}`}
        description={`${c.currentTitle} → ${c.preferences.targetRoles.join(" / ")} · ${c.preferences.locations.join(", ")}${c.preferences.sponsorshipRequired ? " · needs sponsorship" : ""}`}
        actions={
          <>
            <span className={cn("inline-flex h-9 items-center rounded-full px-3 font-display text-xs font-bold", stale ? "bg-status-waiting-tint text-status-waiting" : "bg-status-progressing-tint text-status-progressing")}>
              {stale ? `Stale — ${Math.floor(hours / 24)} d ${Math.round(hours % 24)} h since last movement` : `Moving — ${Math.round(hours)} h since last event`}
            </span>
            <Button size="sm" variant="outline" onClick={() => setSchedule({ open: true })} disabled={!state.applications.length}>
              <CalendarPlus aria-hidden="true" /> Schedule interview
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAssign(true)}>
              <ListPlus aria-hidden="true" /> Assign task
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/reports?candidate=${id}`}>
                <NotebookText aria-hidden="true" /> Weekly report
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <div className="space-y-5">
          <QuickLog candidateId={id} firstName={c.firstName} />

          <Panel title="Applications" count={state.applications.length} bodyClassName="p-0 sm:p-0">
            {state.applications.length === 0 ? (
              <p className="p-5 text-sm text-body">Nothing logged yet — the first quick-log above starts the pipeline and the candidate's dashboard.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-fog text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <tr>
                      {COLUMNS.map((h) => (
                        <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-display">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {state.applications.map((a) => (
                      <ApplicationRow key={a.id} candidateId={id} firstName={c.firstName} a={a} onSchedule={(appId) => setSchedule({ open: true, appId })} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title={`Waiting on ${c.firstName}`} count={state.tasks.open.length} bodyClassName="py-1 sm:py-1">
            {state.tasks.open.length ? (
              <ul className="divide-y divide-hairline">
                {state.tasks.open.map((t) => (
                  <li key={t.id} className="py-2.5 text-sm">
                    <p className="font-semibold text-ink">{t.title}</p>
                    <p className="text-xs text-muted-foreground">Due {fmtDate(t.dueAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-body">Nothing outstanding on the candidate's side.</p>
            )}
          </Panel>

          <Panel title="Your open follow-ups" count={state.tasks.consultantOpen.length} bodyClassName="py-1 sm:py-1">
            {state.tasks.consultantOpen.length ? (
              <ul className="divide-y divide-hairline">
                {state.tasks.consultantOpen.map((t) => (
                  <li key={t.id} className="py-2.5 text-sm">
                    <p className="font-semibold text-ink">{t.title}</p>
                    <p className="text-xs text-muted-foreground">Due {fmtDate(t.dueAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-body">None scheduled — every quick-log adds one automatically.</p>
            )}
          </Panel>

          <Panel title="Recent activity" count={state.events.length} bodyClassName="py-1 sm:py-1">
            <ul className="divide-y divide-hairline">
              {recent.map((e) => (
                <li key={e.id} className="py-2.5 text-sm">
                  <p className="font-semibold text-ink">{e.title}</p>
                  {e.detail && <p className="text-xs text-body">{e.detail}</p>}
                  <p className="text-xs text-muted-foreground">
                    {e.actor === "candidate" ? c.firstName : e.actor === "consultant" ? "You" : e.actor === "employer" ? "Employer" : "System"} · {fmtDateTime(e.at)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <ScheduleInterviewSheet
        open={schedule.open}
        onOpenChange={(open) => setSchedule((s) => ({ ...s, open }))}
        candidateId={id}
        applications={state.applications}
        preselect={schedule.appId}
      />
      <AssignTaskSheet open={assign} onOpenChange={setAssign} candidateId={id} applications={state.applications} />
    </div>
  );
}
