import { useState } from "react";
import { Link } from "wouter";
import { Download, LogOut, Shield, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NotificationSettings } from "../data/types";
import { useWorkspace } from "../data/WorkspaceContext";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { cn } from "@/lib/utils";

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-teal-700" : "bg-hairline-strong")}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200", checked ? "translate-x-[1.375rem]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const { state, data, mode } = useWorkspace();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const n = state.notifications;
  const set = (patch: Partial<NotificationSettings>) => data.updateNotifications({ ...n, ...patch });
  const setChannel = (patch: Partial<NotificationSettings["channels"]>) => data.updateNotifications({ ...n, channels: { ...n.channels, ...patch } });
  const flash = (msg: string) => {
    setDone(msg);
    setTimeout(() => setDone(null), 2500);
  };

  return (
    <div>
      <PageHeader title="Settings" description="How and when we reach you, and what happens to your data. No dark patterns: every switch here does exactly what it says." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Notifications" bodyClassName="py-1 sm:py-1">
          <div className="divide-y divide-hairline">
            <Toggle label="Instant" hint="Shortlists, interviews and employer replies — the moment they are logged." checked={n.instant} onChange={(v) => set({ instant: v })} />
            <Toggle label="Daily digest" hint="One email at 18:00 with everything else from the day (applications sent, follow-ups, notes)." checked={n.dailyDigest} onChange={(v) => set({ dailyDigest: v })} />
            <Toggle label="Weekly report" hint="Monday 09:00 — what we did, what happened, what's next." checked={n.weeklyReport} onChange={(v) => set({ weeklyReport: v })} />
          </div>
          <p className="mt-3 pb-2 text-xs font-semibold text-muted-foreground">Channels</p>
          <div className="divide-y divide-hairline">
            <Toggle label="Email" hint={state.candidate.email} checked={n.channels.email} onChange={(v) => setChannel({ email: v })} />
            <Toggle label="WhatsApp" hint={state.candidate.phone ?? "Add a number in your profile"} checked={n.channels.whatsapp} onChange={(v) => setChannel({ whatsapp: v })} />
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Your data">
            <ul className="space-y-3 text-sm text-body">
              <li className="flex gap-2.5"><Shield className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> Stored in the UK. Used only to run your search. Never sold, never used to train anything.</li>
              <li className="flex gap-2.5"><Shield className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> Deleted 12 months after your search closes unless you ask us to keep it.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => { data.requestDataExport(); flash("Export requested — it will be emailed within 24 hours."); }}>
                <Download aria-hidden="true" /> Export my data
              </Button>
              {!confirmDelete ? (
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => setConfirmDelete(true)}>
                  <Trash2 aria-hidden="true" /> Delete my account
                </Button>
              ) : (
                <span className="flex flex-wrap items-center gap-2 rounded-lg border border-hairline bg-mist px-3 py-2 text-xs text-body">
                  This closes your search and erases everything after 30 days.
                  <Button size="sm" variant="outline" className="h-8 border-destructive text-destructive hover:bg-red-50" onClick={() => { data.requestAccountDeletion(); setConfirmDelete(false); flash("Deletion requested — Daniel will confirm within one business day."); }}>
                    Yes, delete
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => setConfirmDelete(false)}>Keep my account</Button>
                </span>
              )}
            </div>
            {done && <p className="mt-3 text-sm font-medium text-teal-700" role="status">{done}</p>}
            <p className="mt-3 text-xs text-muted-foreground">
              <Link href="~/privacy-policy" className="underline underline-offset-2">Privacy policy</Link> · <Link href="~/terms-and-conditions" className="underline underline-offset-2">Terms</Link>
            </p>
          </Panel>

          <Panel title="Session">
            <Button asChild variant="outline" size="sm">
              <Link href="~/">
                <LogOut aria-hidden="true" /> {mode === "demo" ? "Leave the sample workspace" : "Sign out"}
              </Link>
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
