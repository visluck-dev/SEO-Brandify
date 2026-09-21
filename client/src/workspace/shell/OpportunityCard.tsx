import { useState } from "react";
import { Link } from "wouter";
import { Check, ExternalLink, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Opportunity } from "../data/types";
import { fmtDate } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

const DECLINE_REASONS = ["Location or commute", "Salary below my floor", "Not the right level", "Sector or company", "Too many days on site", "Other"];

/** A role the consultant is considering. Approve → it becomes an application; decline → the reason refines targeting. */
export function OpportunityCard({ opportunity: o, className }: { opportunity: Opportunity; className?: string }) {
  const { data } = useWorkspace();
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState(DECLINE_REASONS[0]);
  const decided = o.decision;

  return (
    <article className={cn("rounded-xl border border-hairline bg-white p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-ink">{o.company}</p>
          <p className="text-sm text-body">{o.role}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {o.location} · {o.workMode}
            {o.salaryRange ? ` · ${o.salaryRange}` : ""}
          </p>
        </div>
        {o.jobUrl && (
          <a href={o.jobUrl} target="_blank" rel="noreferrer" className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-mist hover:text-ink" aria-label={`Open the ${o.company} job advert`}>
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
      <p className="mt-2.5 rounded-lg bg-mist px-3 py-2 text-sm leading-relaxed text-body">
        <span className="font-semibold text-ink">Why it fits: </span>
        {o.whyFit}
      </p>

      {decided ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {decided.decision === "approved" ? "Approved" : "Declined"} {fmtDate(decided.at)}
          {decided.reason ? ` · ${decided.reason}` : ""}
          {o.applicationId && (
            <>
              {" · "}
              <Link href={WS.application(o.applicationId)} className="font-medium text-teal-700 hover:underline">
                See application
              </Link>
            </>
          )}
        </p>
      ) : declining ? (
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            data.decideOpportunity(o.id, "declined", reason);
          }}
        >
          <label htmlFor={`reason-${o.id}`} className="sr-only">
            Reason
          </label>
          <select id={`reason-${o.id}`} value={reason} onChange={(e) => setReason(e.target.value)} className="h-10 flex-1 rounded-lg border border-hairline bg-mist px-3 text-sm text-ink focus:bg-white">
            {DECLINE_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button type="submit" size="sm" variant="outline">
              Decline
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setDeclining(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="accent" onClick={() => data.decideOpportunity(o.id, "approved")}>
            <Check aria-hidden="true" /> Apply for this
          </Button>
          <Button size="sm" variant="outline" onClick={() => setDeclining(true)}>
            <X aria-hidden="true" /> Not for me
          </Button>
        </div>
      )}
    </article>
  );
}
