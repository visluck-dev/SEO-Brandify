import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationView } from "../data/derive";
import type { TaskKind } from "../data/types";
import { defaultSlot, labelClass, selectClass } from "./formStyles";
import { useOps } from "./OpsContext";

const KINDS: { value: TaskKind; label: string }[] = [
  { value: "custom", label: "Something to send or do" },
  { value: "approve-cv", label: "Review a document" },
  { value: "review-opportunities", label: "Review opportunities" },
  { value: "prep", label: "Interview preparation" },
  { value: "check-in", label: "Check-in" },
];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  candidateId: string;
  applications: ApplicationView[];
}

/** Assign task → a dated action in the candidate's workspace, with a note that explains why. */
export function AssignTaskSheet({ open, onOpenChange, candidateId, applications }: Props) {
  const { store } = useOps();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [kind, setKind] = useState<TaskKind>("custom");
  const [due, setDue] = useState(defaultSlot(store.now).slice(0, 10));
  const [appId, setAppId] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(28rem,92vw)] overflow-y-auto border-l-hairline">
        <SheetTitle className="font-display text-lg font-bold text-ink">Assign a task</SheetTitle>
        <SheetDescription className="text-sm text-body">Small and dated. Say why it matters — the candidate sees the note.</SheetDescription>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            store.assignTask(candidateId, { title: title.trim(), detail: detail.trim() || undefined, kind, dueAt: `${due}T18:00:00.000Z`, applicationId: appId || undefined });
            setTitle("");
            setDetail("");
            onOpenChange(false);
          }}
        >
          <div>
            <label htmlFor="at-title" className={labelClass}>Task</label>
            <Input id="at-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Send two referee names" className="mt-1 h-10" />
          </div>
          <div>
            <label htmlFor="at-detail" className={labelClass}>Why / how</label>
            <Textarea id="at-detail" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Wrenfield ask for referees before stage 2 — a name and a job title each is enough." className="mt-1 min-h-[4.5rem]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="at-kind" className={labelClass}>Type</label>
              <select id="at-kind" value={kind} onChange={(e) => setKind(e.target.value as TaskKind)} className={`${selectClass} mt-1`}>
                {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="at-due" className={labelClass}>Due</label>
              <Input id="at-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} className="mt-1 h-10" />
            </div>
          </div>
          <div>
            <label htmlFor="at-app" className={labelClass}>Related application (optional)</label>
            <select id="at-app" value={appId} onChange={(e) => setAppId(e.target.value)} className={`${selectClass} mt-1`}>
              <option value="">None</option>
              {applications.map((a) => <option key={a.id} value={a.id}>{a.company} — {a.role}</option>)}
            </select>
          </div>
          <Button type="submit" variant="accent" disabled={!title.trim()}>Assign</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
