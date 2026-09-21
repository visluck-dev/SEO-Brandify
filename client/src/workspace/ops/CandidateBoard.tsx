import { Link } from "wouter";
import { ArrowRight, CircleAlert } from "lucide-react";

import { fmtDate, relativeTime } from "../data/format";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { cn } from "@/lib/utils";
import { useOps } from "./OpsContext";
import { STALE_AFTER_HOURS, type OpsRow } from "./OpsStore";

const COLUMNS = ["Candidate", "Consultant", "Week", "Last movement", "Last login", "Apps", "Waiting on them", "Due today", ""];

function Tile({ label, value, tone }: { label: string; value: number | string; tone?: "warn" | "ok" }) {
  return (
    <div className="rounded-xl border border-hairline bg-white px-4 py-3.5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className={cn("tabular mt-1 font-display text-2xl font-extrabold", tone === "warn" ? "text-status-waiting" : tone === "ok" ? "text-status-progressing" : "text-ink")}>{value}</p>
    </div>
  );
}

function Staleness({ r }: { r: OpsRow }) {
  const h = Math.round(r.hoursSinceEvent);
  const label = h < 24 ? `${h} h ago` : `${Math.floor(h / 24)} d ${h % 24} h ago`;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-display text-xs font-bold", r.stale ? "bg-status-waiting-tint text-status-waiting" : "bg-status-progressing-tint text-status-progressing")}>
      {r.stale && <CircleAlert className="size-3.5" aria-hidden="true" />}
      {label}
    </span>
  );
}

export function CandidateBoard() {
  const { store } = useOps();
  const rows = store.rows();
  const stale = rows.filter((r) => r.stale);
  const compliance = Math.round(((rows.length - stale.length) / rows.length) * 100);
  const seenAt = (r: OpsRow) => new Date(new Date(store.now).getTime() - r.daysSinceSeen * 86_400_000).toISOString();

  return (
    <div>
      <PageHeader title="Candidates" description={`Sorted by the 48-hour movement rule: anyone without a logged event in ${STALE_AFTER_HOURS} hours rises to the top. Console clock: ${fmtDate(store.now)}.`} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Active candidates" value={rows.length} />
        <Tile label="Stale (over 48 h)" value={stale.length} tone={stale.length ? "warn" : "ok"} />
        <Tile label="Movement compliance" value={`${compliance}%`} tone={compliance >= 95 ? "ok" : "warn"} />
        <Tile label="Follow-ups due today" value={rows.reduce((n, r) => n + r.followupsDueToday, 0)} />
        <Tile label="Interviews this week" value={rows.reduce((n, r) => n + r.interviewsThisWeek, 0)} />
      </div>

      <Panel title="Staleness queue" count={rows.length} bodyClassName="p-0 sm:p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-fog text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                {COLUMNS.map((h, i) => (
                  <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 font-display">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((r) => (
                <tr key={r.id} className={cn("hover:bg-mist", r.stale && "bg-status-waiting-tint/40")}>
                  <td className="px-4 py-3">
                    <Link href={`/candidates/${r.id}`} className="font-display font-bold text-ink hover:text-teal-700">
                      {r.name}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{r.onboardingDone ? r.status : "onboarding incomplete"}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-body">{r.consultant}</td>
                  <td className="tabular px-4 py-3 text-body">{r.week}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Staleness r={r} />
                  </td>
                  <td className={cn("whitespace-nowrap px-4 py-3", r.atRisk ? "font-semibold text-status-waiting" : "text-body")}>
                    {relativeTime(seenAt(r), store.now)}
                    {r.atRisk && <span className="block text-xs">no login for {Math.floor(r.daysSinceSeen)} days — at risk</span>}
                  </td>
                  <td className="tabular px-4 py-3 text-body">{r.applications}</td>
                  <td className="tabular px-4 py-3 text-body">{r.candidateOpen}</td>
                  <td className="tabular px-4 py-3 text-body">{r.followupsDueToday}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/candidates/${r.id}`} className="inline-flex items-center gap-1 whitespace-nowrap font-display text-xs font-semibold text-teal-700 hover:underline">
                      {r.stale ? "Log movement" : "Open"} <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
