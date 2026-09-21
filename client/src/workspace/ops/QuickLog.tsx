import { useState } from "react";
import { Link2, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApplicationSource, ApplicationStage } from "../data/types";
import { fmtDate } from "../data/format";
import { Panel } from "../shell/Panel";
import { useOps } from "./OpsContext";

const SOURCES: ApplicationSource[] = ["Company site", "LinkedIn", "Job board", "Recruiter", "Referral"];

const titleCase = (s: string) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();

/** Simulates the backend's OG-tag fetch: company from the host, role from the last path segment. */
function guessFromUrl(url: string): { company: string; role: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www|careers|jobs|apply)\./, "").split(".")[0];
    const seg = u.pathname.split("/").filter(Boolean).filter((p) => !/^\d+$/.test(p)).pop() ?? "";
    return { company: titleCase(host), role: titleCase(seg) };
  } catch {
    return { company: "", role: "" };
  }
}

const select = "h-10 w-full rounded-lg border border-hairline bg-mist px-3 text-sm text-ink focus:bg-white";

/** The 10-second flow: paste → fetch → check → log. A follow-up is scheduled automatically. */
export function QuickLog({ candidateId, firstName }: { candidateId: string; firstName: string }) {
  const { store } = useOps();
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("London");
  const [source, setSource] = useState<ApplicationSource>("Company site");
  const [stage, setStage] = useState<ApplicationStage>("applied");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const fetchDetails = () => {
    const g = guessFromUrl(url);
    setCompany(g.company);
    setRole(g.role);
    setFetched(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    store.logApplication(candidateId, { company: company.trim(), role: role.trim(), location: location.trim(), jobUrl: url || undefined, source, stage, note: note.trim() || undefined });
    const followup = new Date(new Date(store.now).getTime() + 7 * 86_400_000).toISOString();
    setDone(`Logged. Follow-up scheduled for ${fmtDate(followup)}. ${firstName} sees it now.`);
    setUrl(""); setCompany(""); setRole(""); setNote(""); setFetched(false); setStage("applied");
    setTimeout(() => setDone(null), 4000);
  };

  return (
    <Panel title="Quick-log an application" action={<span className="text-xs text-muted-foreground">Target: 10 seconds</span>}>
      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste the job advert URL" aria-label="Job advert URL" className="h-10 pl-9" />
          </div>
          <Button type="button" variant="outline" size="sm" className="h-10" onClick={fetchDetails} disabled={!url.trim()}>
            <Sparkles aria-hidden="true" /> Fetch details
          </Button>
        </div>
        {(fetched || company || role) && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" aria-label="Company" className="h-10" />
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" aria-label="Role" className="h-10" />
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" aria-label="Location" className="h-10" />
              <select value={source} onChange={(e) => setSource(e.target.value as ApplicationSource)} aria-label="Source" className={select}>
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={stage} onChange={(e) => setStage(e.target.value as ApplicationStage)} aria-label="Stage" className={select}>
                <option value="applied">Applied</option>
                <option value="shortlisted">Already shortlisted</option>
              </select>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note for the candidate (optional)" aria-label="Note" className="h-10" />
            </div>
            <Button type="submit" size="sm" variant="accent" disabled={!company.trim() || !role.trim()}>
              <Send aria-hidden="true" /> Log application
            </Button>
          </>
        )}
        {done && (
          <p role="status" className="rounded-lg bg-status-progressing-tint px-3 py-2 text-sm font-medium text-status-progressing">
            {done}
          </p>
        )}
      </form>
    </Panel>
  );
}
