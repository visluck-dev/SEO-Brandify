import { useMemo, useState } from "react";
import { useSearch } from "wouter";
import { Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { WeeklyReport } from "../data/types";
import { fmtDateTime, fmtWeekOf } from "../data/format";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { labelClass, selectClass } from "./formStyles";
import { useOps } from "./OpsContext";

type Draft = Omit<WeeklyReport, "id" | "publishedAt">;

const lines = (arr: string[]) => arr.join("\n");
const unlines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/** Monday 09:00 ritual: auto-draft from the event log, edit, publish. */
export function ReportComposer() {
  const { store, version } = useOps();
  const search = useSearch();
  const rows = useMemo(() => store.rows(), [store, version]);
  const preselect = new URLSearchParams(search).get("candidate");
  const [candidateId, setCandidateId] = useState(preselect && rows.some((r) => r.id === preselect) ? preselect : rows[0]?.id ?? "");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [published, setPublished] = useState<string | null>(null);

  const state = store.state(candidateId);
  const row = rows.find((r) => r.id === candidateId);

  const generate = () => {
    const d = store.draftReport(candidateId);
    if (d) setDraft(d);
    setPublished(null);
  };

  const publish = () => {
    if (!draft) return;
    store.publishReport(candidateId, draft);
    setPublished(`Published to ${row?.name ?? "the candidate"} — in their workspace now and emailed at 09:00.`);
    setDraft(null);
  };

  const field = (key: "did" | "happened" | "next", label: string, hint: string) => (
    <div>
      <label htmlFor={`rep-${key}`} className={labelClass}>
        {label}
      </label>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <Textarea id={`rep-${key}`} value={lines(draft![key])} onChange={(e) => setDraft({ ...draft!, [key]: unlines(e.target.value) })} className="mt-1.5 min-h-[7rem] bg-mist focus:bg-white" />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Weekly report composer"
        description="Drafted from the last seven days of the activity log so nothing is forgotten; you edit the words, the numbers come from the events. One line per bullet."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <Panel title="Compose">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="rep-candidate" className={labelClass}>
                Candidate
              </label>
              <select
                id="rep-candidate"
                value={candidateId}
                onChange={(e) => {
                  setCandidateId(e.target.value);
                  setDraft(null);
                  setPublished(null);
                }}
                className={`${selectClass} mt-1`}
              >
                {rows.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — week {r.week}
                  </option>
                ))}
              </select>
            </div>
            <Button type="button" variant="outline" onClick={generate} disabled={!candidateId}>
              <Sparkles aria-hidden="true" /> Draft from this week's activity
            </Button>
          </div>

          {draft && (
            <div className="mt-5 space-y-4">
              <dl className="grid grid-cols-4 gap-2">
                {(
                  [
                    ["Applications", draft.numbers.applications],
                    ["Replies", draft.numbers.replies],
                    ["Interviews", draft.numbers.interviews],
                    ["Follow-ups", draft.numbers.followups],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-mist px-2.5 py-2 text-center">
                    <dd className="tabular font-display text-lg font-extrabold text-ink">{v}</dd>
                    <dt className="text-[0.6875rem] font-semibold text-muted-foreground">{k}</dt>
                  </div>
                ))}
              </dl>
              {field("did", "What we did", "Applications, follow-ups, documents, research.")}
              {field("happened", "What happened", "Replies, stage changes, interviews, feedback. Say plainly when nothing moved.")}
              {field("next", "What's next", "Dated where possible. Include what you need from the candidate.")}
              <div>
                <label htmlFor="rep-note" className={labelClass}>
                  Personal note (optional)
                </label>
                <Textarea id="rep-note" value={draft.note ?? ""} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="One or two sentences in your own voice." className="mt-1.5 min-h-[3.5rem] bg-mist focus:bg-white" />
              </div>
              <Button type="button" variant="accent" onClick={publish}>
                <Send aria-hidden="true" /> Publish to candidate
              </Button>
            </div>
          )}
          {published && (
            <p role="status" className="mt-4 rounded-lg bg-status-progressing-tint px-3 py-2 text-sm font-medium text-status-progressing">
              {published}
            </p>
          )}
        </Panel>

        <Panel title="Published" count={state?.reports.length ?? 0}>
          {state?.reports.length ? (
            <ul className="space-y-3">
              {state.reports.map((r) => (
                <li key={r.id} className="rounded-lg border border-hairline px-3 py-2.5 text-sm">
                  <p className="font-display font-bold text-ink">
                    Week {r.week} — {fmtWeekOf(r.weekStartsOn)}
                  </p>
                  <p className="text-xs text-muted-foreground">{fmtDateTime(r.publishedAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-body">No reports published yet for this candidate.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
