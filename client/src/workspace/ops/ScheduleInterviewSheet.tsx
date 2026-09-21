import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { ApplicationView } from "../data/derive";
import type { InterviewFormat } from "../data/types";
import { defaultSlot, labelClass, selectClass } from "./formStyles";
import { useOps } from "./OpsContext";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  candidateId: string;
  applications: ApplicationView[];
  preselect?: string;
}

/** Schedule interview → creates the interview, moves the stage, and gives the candidate confirm + prep tasks. */
export function ScheduleInterviewSheet({ open, onOpenChange, candidateId, applications, preselect }: Props) {
  const { store } = useOps();
  const eligible = applications.filter((a) => a.stage !== "closed");
  const [appId, setAppId] = useState(preselect ?? eligible[0]?.id ?? "");
  const [at, setAt] = useState(defaultSlot(store.now));
  const [format, setFormat] = useState<InterviewFormat>("Video");
  const [where, setWhere] = useState("Teams link in the invite");
  const [stageLabel, setStageLabel] = useState("Stage 1 — hiring manager");
  const [interviewers, setInterviewers] = useState("");

  useEffect(() => {
    if (open && preselect) setAppId(preselect);
  }, [open, preselect]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(28rem,92vw)] overflow-y-auto border-l-hairline">
        <SheetTitle className="font-display text-lg font-bold text-ink">Schedule an interview</SheetTitle>
        <SheetDescription className="text-sm text-body">The candidate gets a confirm task today and a prep task the day before.</SheetDescription>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!appId) return;
            store.scheduleInterview(candidateId, appId, { at: new Date(at).toISOString(), durationMinutes: 45, format, where, stageLabel, interviewers });
            onOpenChange(false);
          }}
        >
          <div>
            <label htmlFor="si-app" className={labelClass}>Application</label>
            <select id="si-app" value={appId} onChange={(e) => setAppId(e.target.value)} className={`${selectClass} mt-1`}>
              {eligible.map((a) => (
                <option key={a.id} value={a.id}>{a.company} — {a.role}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="si-at" className={labelClass}>Date and time</label>
              <Input id="si-at" type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} className="mt-1 h-10" />
            </div>
            <div>
              <label htmlFor="si-format" className={labelClass}>Format</label>
              <select id="si-format" value={format} onChange={(e) => setFormat(e.target.value as InterviewFormat)} className={`${selectClass} mt-1`}>
                {(["Video", "In person", "Phone"] as const).map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="si-stage" className={labelClass}>Stage</label>
            <Input id="si-stage" value={stageLabel} onChange={(e) => setStageLabel(e.target.value)} className="mt-1 h-10" />
          </div>
          <div>
            <label htmlFor="si-where" className={labelClass}>Where / link</label>
            <Input id="si-where" value={where} onChange={(e) => setWhere(e.target.value)} className="mt-1 h-10" />
          </div>
          <div>
            <label htmlFor="si-who" className={labelClass}>Interviewers (comma-separated)</label>
            <Input id="si-who" value={interviewers} onChange={(e) => setInterviewers(e.target.value)} placeholder="Rachel Okafor, Head of Change" className="mt-1 h-10" />
          </div>
          <Button type="submit" variant="accent" disabled={!appId}>Book and notify the candidate</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
