import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Flag, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { fmtWc } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

const STEPS = ["Your details", "CV & LinkedIn", "Targets", "Availability", "Notifications"] as const;

function Field({ label, htmlFor, children, hint }: { label: string; htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} className={cn("h-9 rounded-full border px-3.5 font-display text-xs font-semibold transition-colors", on ? "border-ink bg-ink text-white" : "border-hairline bg-white text-body hover:bg-mist")}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-teal-700" : "bg-hairline-strong")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[1.375rem]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}

/** The first run: five short steps, then the plan. Nobody lands on an empty dashboard. */
export default function OnboardingPage() {
  const { state } = useWorkspace();
  const [, navigate] = useLocation();
  const c = state.candidate;
  const first = state.consultant.name.split(" ")[0];
  const [step, setStep] = useState(0); // 0 = welcome, 1..5 = steps, 6 = plan
  const [modes, setModes] = useState<string[]>(c.preferences.workModes);
  const [times, setTimes] = useState<string[]>(["Weekday mornings", "Weekday afternoons"]);
  const [notify, setNotify] = useState({ instant: true, daily: true, weekly: true, email: true, whatsapp: true });
  const [cvName, setCvName] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(6, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-[100dvh] bg-mist">
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link href={WS.today} className="font-display text-xs font-semibold text-muted-foreground hover:text-ink">Skip to the workspace</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {step >= 1 && step <= 5 && (
          <ol className="mb-6 flex gap-1.5" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s} className="flex-1">
                <span className={cn("block h-1.5 rounded-full", i + 1 < step ? "bg-teal-600" : i + 1 === step ? "bg-ink" : "bg-hairline")} />
                <span className="sr-only">{s}{i + 1 === step ? " (current)" : ""}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-8">
          {step === 0 && (
            <div>
              <p className="eyebrow mb-2">Welcome</p>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Your workspace is ready, {c.firstName}.</h1>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-body">
                I'm {first}, your consultant. Five quick steps — about four minutes — and then I'll show you the plan we agreed on the call. From here on, everything I do for your search is logged in this workspace, so you always know what's happening.
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-body sm:grid-cols-2">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-2.5 rounded-lg bg-mist px-3 py-2"><span className="tabular font-display font-bold text-teal-700">{i + 1}</span>{s}</li>
                ))}
              </ul>
              <Button size="lg" className="mt-6" onClick={next}>Let's start <ArrowRight aria-hidden="true" /></Button>
            </div>
          )}

          {step === 1 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); next(); }}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Confirm your details</h2>
              <p className="text-sm text-body">We use these on applications, so a quick check now saves a correction later.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" htmlFor="ob-first"><Input id="ob-first" defaultValue={c.firstName} /></Field>
                <Field label="Last name" htmlFor="ob-last"><Input id="ob-last" defaultValue={c.lastName} /></Field>
                <Field label="Email" htmlFor="ob-email"><Input id="ob-email" type="email" defaultValue={c.email} /></Field>
                <Field label="WhatsApp / phone" htmlFor="ob-phone"><Input id="ob-phone" defaultValue={c.phone} /></Field>
                <Field label="Where you live" htmlFor="ob-loc"><Input id="ob-loc" defaultValue={c.location} /></Field>
                <Field label="Current or most recent role" htmlFor="ob-title"><Input id="ob-title" defaultValue={c.currentTitle} /></Field>
              </div>
              <Nav onBack={back} />
            </form>
          )}

          {step === 2 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); next(); }}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Your CV and LinkedIn</h2>
              <p className="text-sm text-body">Any format, any state — {first} rebuilds it from here. Version 1 is filed as your baseline so you can always see what changed.</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hairline-strong bg-mist px-4 py-8 text-center hover:border-teal-600">
                <Upload className="size-6 text-teal-700" aria-hidden="true" />
                <span className="font-display text-sm font-semibold text-ink">{cvName ?? "Upload your current CV"}</span>
                <span className="text-xs text-muted-foreground">PDF or Word, up to 5 MB</span>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setCvName(e.target.files?.[0]?.name ?? null)} />
              </label>
              <Field label="LinkedIn profile" htmlFor="ob-li" hint="Optional now — it is rewritten in week 2."><Input id="ob-li" placeholder="https://linkedin.com/in/your-name" /></Field>
              <Nav onBack={back} />
            </form>
          )}

          {step === 3 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); next(); }}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">What we are aiming for</h2>
              <p className="text-sm text-body">Pre-filled from your call with {first}. Change anything — this is what every opportunity is checked against.</p>
              <Field label="Target roles" htmlFor="ob-roles" hint="Two or three, comma-separated."><Input id="ob-roles" defaultValue={c.preferences.targetRoles.join(", ")} /></Field>
              <Field label="Locations" htmlFor="ob-locs"><Input id="ob-locs" defaultValue={c.preferences.locations.join(", ")} /></Field>
              <Field label="Working pattern"><Chips options={["On-site", "Hybrid", "Remote"]} value={modes} onChange={setModes} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Salary floor (£)" htmlFor="ob-salary" hint="Private to VisLuck."><Input id="ob-salary" type="number" defaultValue={c.preferences.salaryFloor} /></Field>
                <Field label="Application approval">
                  <select className="h-11 w-full rounded-lg border border-hairline bg-mist px-3 text-sm text-ink" defaultValue={c.preferences.approvalMode} aria-label="Application approval">
                    <option value="approve-first">Approve each role first</option>
                    <option value="trusted">Trusted — apply within my targets</option>
                  </select>
                </Field>
              </div>
              <label className="flex items-start gap-3 text-sm text-body"><input type="checkbox" defaultChecked={c.preferences.sponsorshipRequired} className="mt-0.5 size-4 accent-teal-700" /> I need visa sponsorship</label>
              <Nav onBack={back} />
            </form>
          )}

          {step === 4 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); next(); }}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">When you can talk to employers</h2>
              <p className="text-sm text-body">Interview slots get booked against this, so {first} never offers a time you cannot make.</p>
              <Field label="Notice period">
                <select className="h-11 w-full rounded-lg border border-hairline bg-mist px-3 text-sm text-ink sm:w-64" defaultValue={c.preferences.noticePeriod} aria-label="Notice period">
                  {["Immediately", "1 week", "2 weeks", "4 weeks", "8 weeks", "12 weeks"].map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Usually free for interviews"><Chips options={["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Lunchtimes only"]} value={times} onChange={setTimes} /></Field>
              <Field label="Dates to avoid" htmlFor="ob-avoid" hint="Holidays, exams, anything fixed."><Input id="ob-avoid" placeholder="e.g. 3–7 November" /></Field>
              <Nav onBack={back} />
            </form>
          )}

          {step === 5 && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); next(); }}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">How we reach you</h2>
              <p className="text-sm text-body">Every switch does exactly what it says, and you can change them any time in Settings.</p>
              <div className="divide-y divide-hairline">
                <Toggle label="Instant — shortlists, interviews, employer replies" checked={notify.instant} onChange={(v) => setNotify({ ...notify, instant: v })} />
                <Toggle label="Daily digest at 18:00 — everything else" checked={notify.daily} onChange={(v) => setNotify({ ...notify, daily: v })} />
                <Toggle label="Weekly report — Monday 09:00" checked={notify.weekly} onChange={(v) => setNotify({ ...notify, weekly: v })} />
              </div>
              <p className="pt-2 text-xs font-semibold text-muted-foreground">Channels</p>
              <div className="divide-y divide-hairline">
                <Toggle label={`Email · ${c.email}`} checked={notify.email} onChange={(v) => setNotify({ ...notify, email: v })} />
                <Toggle label={`WhatsApp · ${c.phone ?? "add a number"}`} checked={notify.whatsapp} onChange={(v) => setNotify({ ...notify, whatsapp: v })} />
              </div>
              <Nav onBack={back} label="Show me the plan" />
            </form>
          )}

          {step === 6 && (
            <div>
              <p className="eyebrow mb-2">Your search plan</p>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">The next eight weeks</h2>
              <p className="mt-2 text-sm leading-relaxed text-body">One focus and one milestone a week, agreed on your call. Three small tasks are already waiting for you; nothing is sent to an employer without your OK.</p>
              <ol className="mt-5 space-y-2">
                {state.plan.map((w) => (
                  <li key={w.week} className="flex gap-3 rounded-xl border border-hairline px-4 py-3">
                    <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-white" aria-hidden="true">{w.week}</span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline justify-between gap-x-3 font-display text-sm font-bold text-ink">{w.title}<span className="text-xs font-semibold text-muted-foreground">{fmtWc(w.startsOn)}</span></p>
                      <p className="text-sm text-body">{w.focus}</p>
                      {w.milestone && <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-teal-700"><Flag className="size-3.5" aria-hidden="true" />{w.milestone}</p>}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button size="lg" onClick={() => navigate(WS.today)}><Check aria-hidden="true" /> Go to Today</Button>
                <Button size="lg" variant="ghost" onClick={back}><ArrowLeft aria-hidden="true" /> Back</Button>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Sample first run — nothing you type here is stored.</p>
      </main>
    </div>
  );
}

function Nav({ onBack, label = "Continue" }: { onBack: () => void; label?: string }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <Button type="button" variant="ghost" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back</Button>
      <Button type="submit">{label} <ArrowRight aria-hidden="true" /></Button>
    </div>
  );
}
