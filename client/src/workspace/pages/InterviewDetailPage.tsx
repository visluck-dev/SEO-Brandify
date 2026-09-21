import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarPlus, Check, Clock, MapPin, Users, Video } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewDebrief } from "../data/types";
import { daysBetween, fmtDateLong, fmtTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { EmptyState } from "../shell/EmptyState";
import { addInterviewToCalendar } from "../shell/InterviewCard";
import { Panel } from "../shell/Panel";
import { DebriefForm } from "./InterviewDebrief";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-body">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function InterviewDetailPage({ id }: { id: string }) {
  const { state, data } = useWorkspace();
  const i = state.interviews.all.find((x) => x.id === id);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (i) setAnswers(i.starAnswers);
  }, [i?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!i) {
    return (
      <EmptyState
        title="We could not find that interview"
        body="It may belong to a different moment in the sample search."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href={WS.interviews}>
              <ArrowLeft aria-hidden="true" /> Interviews
            </Link>
          </Button>
        }
      />
    );
  }

  const days = daysBetween(state.now, i.at);
  const Where = i.format === "In person" ? MapPin : Video;
  const confirmTask = state.tasks.open.find((t) => t.interviewId === i.id && t.kind === "confirm-interview");

  return (
    <div>
      <Link href={WS.interviews} className="mb-4 inline-flex items-center gap-1.5 rounded-md font-display text-sm font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> Interviews
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow mb-1.5">{i.isPast ? "Completed" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}</p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-[1.75rem]">
            {i.company} — {i.stageLabel}
          </h2>
          <p className="mt-1 text-base text-body">{i.role}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {!i.isPast && (
            <Button variant="outline" size="sm" onClick={() => addInterviewToCalendar(i)}>
              <CalendarPlus aria-hidden="true" /> Add to calendar
            </Button>
          )}
          {!i.isPast && !i.confirmedAt && (
            <Button size="sm" variant="accent" onClick={() => data.confirmInterview(i.id)}>
              <Check aria-hidden="true" /> Confirm I can make it
            </Button>
          )}
          {!i.isPast && i.confirmedAt && <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-status-progressing-tint px-3 font-display text-xs font-semibold text-status-progressing"><Check className="size-3.5" aria-hidden="true" /> Confirmed</span>}
          <Link href={WS.application(i.applicationId)} className="inline-flex h-9 items-center rounded-lg px-3 font-display text-xs font-semibold text-teal-700 hover:bg-mist">
            View application
          </Link>
        </div>
      </div>
      {confirmTask && !i.isPast && !i.confirmedAt && (
        <p className="mb-5 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-ink">Daniel is holding this slot for you — confirm above and he tells the employer today.</p>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="space-y-5">
          <Panel title="Prep kit">
            <Accordion type="multiple" defaultValue={["company", "role", "questions"]} className="divide-y divide-hairline">
              <AccordionItem value="company" className="border-b-0">
                <AccordionTrigger className="py-3 font-display text-sm font-bold text-ink hover:no-underline">Company brief</AccordionTrigger>
                <AccordionContent className="pb-4"><Bullets items={i.prep.companyBrief} /></AccordionContent>
              </AccordionItem>
              <AccordionItem value="role" className="border-b-0">
                <AccordionTrigger className="py-3 font-display text-sm font-bold text-ink hover:no-underline">Role brief</AccordionTrigger>
                <AccordionContent className="pb-4"><Bullets items={i.prep.roleBrief} /></AccordionContent>
              </AccordionItem>
              <AccordionItem value="questions" className="border-b-0">
                <AccordionTrigger className="py-3 font-display text-sm font-bold text-ink hover:no-underline">Likely questions</AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ol className="space-y-2 text-sm leading-relaxed text-body">
                    {i.prep.likelyQuestions.map((q, n) => (
                      <li key={q} className="flex gap-3">
                        <span className="tabular w-5 shrink-0 font-display font-bold text-teal-700">{n + 1}</span>
                        {q}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>

          <Panel title="Your STAR bank">
            <p className="mb-4 text-sm text-body">Situation, Task, Action, Result — three stories you can reach for. Daniel reads these and suggests edits before the day.</p>
            <div className="space-y-4">
              {i.prep.starPrompts.map((prompt, n) => (
                <div key={prompt}>
                  <label htmlFor={`star-${n}`} className="block text-sm font-semibold text-ink">
                    {prompt}
                  </label>
                  <Textarea
                    id={`star-${n}`}
                    value={answers[n] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [n]: e.target.value })}
                    onBlur={() => data.saveStarAnswer(i.id, n, answers[n] ?? "")}
                    placeholder="A few sentences is enough — situation, what you did, what changed."
                    className="mt-1.5 min-h-[5.5rem] bg-mist focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </Panel>

          <div id="debrief">
            {i.isPast ? (
              <DebriefForm interview={i} onSubmit={(d: Omit<InterviewDebrief, "submittedAt">) => data.submitDebrief(i.id, d)} />
            ) : (
              <Panel title="After the interview">
                <p className="text-sm leading-relaxed text-body">A two-minute debrief appears here once the interview has happened: what went well, what they asked, anything you are unsure about. Daniel uses it for the thank-you note and to prepare you for the next stage.</p>
              </Panel>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <Panel title="Logistics">
            <dl className="space-y-3 text-sm text-body">
              <div className="flex items-start gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><dd>{fmtDateLong(i.at)}, {fmtTime(i.at)} · {i.durationMinutes} minutes</dd></div>
              <div className="flex items-start gap-2.5"><Where className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><dd>{i.format} · {i.where}</dd></div>
              <div className="flex items-start gap-2.5"><Users className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><dd>{i.interviewers.join(", ")}</dd></div>
            </dl>
          </Panel>

          <Panel title="Checklist">
            <ul className="space-y-2.5">
              {i.prep.checklist.map((item, n) => (
                <li key={item}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-body">
                    <input type="checkbox" checked={!!checked[n]} onChange={(e) => setChecked({ ...checked, [n]: e.target.checked })} className="mt-0.5 size-4 accent-teal-700" />
                    <span className={checked[n] ? "text-muted-foreground line-through" : ""}>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Panel>

          {i.feedback && (
            <Panel title="Employer feedback">
              <p className="text-sm leading-relaxed text-body">{i.feedback.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">Received {fmtDateLong(i.feedback.at)}</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
