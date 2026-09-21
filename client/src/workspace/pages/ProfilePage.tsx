import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Preferences, WorkMode } from "../data/types";
import { useWorkspace } from "../data/WorkspaceContext";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { cn } from "@/lib/utils";

const WORK_MODES: WorkMode[] = ["On-site", "Hybrid", "Remote"];
const NOTICE = ["Immediately", "1 week", "2 weeks", "4 weeks", "8 weeks", "12 weeks"];

const listToText = (l: string[]) => l.join(", ");
const textToList = (t: string) => t.split(",").map((s) => s.trim()).filter(Boolean);

function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint && <p className="mb-1.5 text-xs text-muted-foreground">{hint}</p>}
      <div className={hint ? "" : "mt-1.5"}>{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { state, data } = useWorkspace();
  const c = state.candidate;
  const [prefs, setPrefs] = useState<Preferences>(c.preferences);
  const [roles, setRoles] = useState(listToText(c.preferences.targetRoles));
  const [locations, setLocations] = useState(listToText(c.preferences.locations));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(c.preferences);
    setRoles(listToText(c.preferences.targetRoles));
    setLocations(listToText(c.preferences.locations));
  }, [c.preferences]);

  const toggleMode = (m: WorkMode) =>
    setPrefs((p) => ({ ...p, workModes: p.workModes.includes(m) ? p.workModes.filter((x) => x !== m) : [...p.workModes, m] }));

  return (
    <div>
      <PageHeader title="Profile & preferences" description="What Daniel targets on your behalf. Change anything here and the target list is adjusted — you will see it in Activity." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Panel title="Your details">
          <dl className="space-y-3 text-sm">
            {[
              ["Name", `${c.firstName} ${c.lastName}`],
              ["Email", c.email],
              ["Phone / WhatsApp", c.phone ?? "—"],
              ["Location", c.location],
              ["Current role", c.currentTitle],
              ["Experience", c.yearsExperience],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-hairline pb-2 last:border-b-0 last:pb-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">To change contact details, message Daniel — they are used on applications, so we double-check them.</p>
        </Panel>

        <Panel title="Targeting">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              data.updatePreferences({ ...prefs, targetRoles: textToList(roles), locations: textToList(locations) });
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          >
            <Field label="Target roles" hint="Comma-separated. Two or three is ideal." htmlFor="pref-roles">
              <Input id="pref-roles" value={roles} onChange={(e) => setRoles(e.target.value)} />
            </Field>
            <Field label="Locations" hint="Cities or regions you would commute to." htmlFor="pref-locations">
              <Input id="pref-locations" value={locations} onChange={(e) => setLocations(e.target.value)} />
            </Field>
            <Field label="Working pattern">
              <div className="flex flex-wrap gap-2">
                {WORK_MODES.map((m) => {
                  const on = prefs.workModes.includes(m);
                  return (
                    <button key={m} type="button" aria-pressed={on} onClick={() => toggleMode(m)} className={cn("h-9 rounded-full border px-3.5 font-display text-xs font-semibold transition-colors", on ? "border-ink bg-ink text-white" : "border-hairline bg-white text-body hover:bg-mist")}>
                      {m}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Salary floor (£)" hint="Private to VisLuck — never shared with employers." htmlFor="pref-salary">
                <div className="relative">
                  <Input id="pref-salary" type="number" inputMode="numeric" step={1000} value={prefs.salaryFloor ?? ""} onChange={(e) => setPrefs({ ...prefs, salaryFloor: e.target.value ? Number(e.target.value) : undefined })} className="pr-9" />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                </div>
              </Field>
              <Field label="Notice period" htmlFor="pref-notice">
                <select id="pref-notice" value={prefs.noticePeriod} onChange={(e) => setPrefs({ ...prefs, noticePeriod: e.target.value })} className="h-11 w-full rounded-lg border border-hairline bg-mist px-3 text-sm text-ink focus:bg-white">
                  {NOTICE.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>
            <label className="flex items-start gap-3 text-sm text-body">
              <input type="checkbox" checked={prefs.sponsorshipRequired} onChange={(e) => setPrefs({ ...prefs, sponsorshipRequired: e.target.checked })} className="mt-0.5 size-4 accent-teal-700" />
              <span><span className="font-semibold text-ink">I need visa sponsorship.</span> Only employers with a sponsor licence are targeted.</span>
            </label>
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Application approval</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {([
                  ["approve-first", "Approve first", "Every role waits for your OK before anything is sent."],
                  ["trusted", "Trusted", "Daniel applies within these targets and you see each one the moment it goes out."],
                ] as const).map(([v, label, desc]) => (
                  <label key={v} className={cn("flex cursor-pointer gap-3 rounded-xl border p-3 text-sm", prefs.approvalMode === v ? "border-teal-600 bg-teal-50" : "border-hairline bg-white hover:bg-mist")}>
                    <input type="radio" name="approval" value={v} checked={prefs.approvalMode === v} onChange={() => setPrefs({ ...prefs, approvalMode: v })} className="mt-0.5 accent-teal-700" />
                    <span><span className="block font-semibold text-ink">{label}</span><span className="text-body">{desc}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm">{saved ? <><Check aria-hidden="true" /> Saved</> : "Save preferences"}</Button>
              <span className="text-xs text-muted-foreground">Daniel is notified of every change.</span>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
