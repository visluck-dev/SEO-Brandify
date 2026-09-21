import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Compass, Search, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApplicationView } from "../data/derive";
import { fmtDate, fmtDateTime, fmtWc } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { EmptyState } from "../shell/EmptyState";
import { PageHeader } from "../shell/PageHeader";
import { StatusPill } from "../shell/StatusPill";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "progressing" | "pending" | "closed";

const FILTERS: { id: Filter; label: string; test: (a: ApplicationView) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "active", label: "Active", test: (a) => a.stage !== "closed" },
  { id: "progressing", label: "Progressing", test: (a) => a.stage === "shortlisted" || a.stage === "interview" || a.stage === "offer" },
  { id: "pending", label: "Awaiting reply", test: (a) => a.stage === "applied" },
  { id: "closed", label: "Closed", test: (a) => a.stage === "closed" },
];

const COLUMNS = ["Company", "Role", "Applied", "Status", "Recruiter", "Interview", "Next action"];

function NextActionCell({ a }: { a: ApplicationView }) {
  if (!a.nextAction) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="block">
      <span className="block truncate font-medium text-ink">{a.nextAction.title.replace(/ — .*$/, "")}</span>
      <span className="text-xs text-muted-foreground">
        {a.nextAction.owner === "candidate" ? "You" : "Daniel"} · {fmtDate(a.nextAction.dueAt)}
      </span>
    </span>
  );
}

function FilterChips({ all, filter, onChange }: { all: ApplicationView[]; filter: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter applications">
      {FILTERS.map((f) => {
        const n = all.filter(f.test).length;
        const active = filter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            aria-pressed={active}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 font-display text-xs font-semibold transition-colors duration-150",
              active ? "border-ink bg-ink text-white" : "border-hairline bg-white text-body hover:bg-mist",
            )}
          >
            {f.label}
            <span className={cn("tabular", active ? "text-white/70" : "text-muted-foreground")}>{n}</span>
          </button>
        );
      })}
    </div>
  );
}

function ApplicationsTable({ rows, total }: { rows: ApplicationView[]; total: number }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-hairline bg-white shadow-card md:block">
      <table className="w-full text-sm">
        <caption className="sr-only">Applications</caption>
        <thead className="bg-fog text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            {COLUMNS.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-display">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map((a) => (
            <tr key={a.id} className="transition-colors hover:bg-mist">
              <td className="px-4 py-3">
                <Link href={WS.application(a.id)} className="font-display font-bold text-ink hover:text-teal-700">
                  {a.company}
                </Link>
                <span className="block text-xs text-muted-foreground">
                  {a.location} · {a.workMode}
                </span>
              </td>
              <td className="px-4 py-3 text-body">{a.role}</td>
              <td className="tabular whitespace-nowrap px-4 py-3 text-body">{fmtDate(a.sentAt)}</td>
              <td className="px-4 py-3">
                <StatusPill tone={a.tone} label={a.statusLabel} />
              </td>
              <td className="px-4 py-3 text-body">
                {a.recruiter ? (
                  <>
                    {a.recruiter.name}
                    <span className="block text-xs text-muted-foreground">{a.recruiter.org}</span>
                  </>
                ) : (
                  "In-house"
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-body">{a.nextInterview ? fmtDateTime(a.nextInterview.at) : "—"}</td>
              <td className="max-w-[14rem] px-4 py-3">
                <NextActionCell a={a} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-hairline bg-mist px-4 py-2.5 text-xs text-muted-foreground">
        Showing {rows.length} of {total}
      </p>
    </div>
  );
}

function ApplicationCards({ rows }: { rows: ApplicationView[] }) {
  return (
    <ul className="space-y-3 md:hidden">
      {rows.map((a) => (
        <li key={a.id}>
          <Link href={WS.application(a.id)} className="block rounded-xl border border-hairline bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">{a.company}</p>
                <p className="text-sm text-body">{a.role}</p>
              </div>
              <StatusPill tone={a.tone} label={a.statusLabel} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Applied</dt>
                <dd className="font-medium text-ink">{fmtDate(a.sentAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Interview</dt>
                <dd className="font-medium text-ink">{a.nextInterview ? fmtDateTime(a.nextInterview.at) : "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Next action</dt>
                <dd className="text-sm">
                  <NextActionCell a={a} />
                </dd>
              </div>
            </dl>
            <span className="mt-3 inline-flex items-center gap-1 font-display text-xs font-semibold text-teal-700">
              Open <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ApplicationsPage() {
  const { state } = useWorkspace();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const all = state.applications;

  const rows = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter)!.test;
    const needle = q.trim().toLowerCase();
    return all.filter((a) => test(a) && (!needle || `${a.company} ${a.role} ${a.location}`.toLowerCase().includes(needle)));
  }, [all, filter, q]);

  const firstWeek = state.plan.find((w) => w.week === 2);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Every application we have sent for you — which CV went with it, who has it, what they said and what happens next."
        actions={
          all.length > 0 && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company or role" aria-label="Search applications" className="h-10 w-full pl-9 sm:w-64" />
            </div>
          )
        }
      />

      {all.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Applications begin once you approve the first roles"
          body="Nothing is sent without your OK. Daniel is building your target list now; the first roles arrive in Opportunities for your approval, and each application appears here the moment it goes out — with the CV version and supporting statement used."
          when={firstWeek ? `First applications ${fmtWc(firstWeek.startsOn)}` : undefined}
          action={
            <Button asChild size="sm">
              <Link href={WS.opportunities}>
                <Compass aria-hidden="true" /> Opportunities
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <FilterChips all={all} filter={filter} onChange={setFilter} />
          {rows.length === 0 ? (
            <EmptyState compact icon={Search} title="No applications match" body="Try another filter or clear the search." />
          ) : (
            <>
              <ApplicationsTable rows={rows} total={all.length} />
              <ApplicationCards rows={rows} />
            </>
          )}
        </>
      )}
    </div>
  );
}
