import { useState } from "react";
import { Check, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewView } from "../data/derive";
import type { InterviewDebrief } from "../data/types";
import { fmtDateTime } from "../data/format";
import { Panel } from "../shell/Panel";
import { cn } from "@/lib/utils";

type Draft = Omit<InterviewDebrief, "submittedAt">;

/** Two minutes, three questions, one rating. Submitting completes the debrief task and pings the consultant. */
export function DebriefForm({ interview: i, onSubmit }: { interview: InterviewView; onSubmit: (d: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>({ rating: 4, wentWell: "", questionsAsked: "", concerns: "" });

  if (i.debrief) {
    const d = i.debrief;
    return (
      <Panel title="Your debrief">
        <p className="mb-3 flex items-center gap-1" aria-label={`Rated ${d.rating} out of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={cn("size-4", n <= d.rating ? "fill-teal-600 text-teal-600" : "text-hairline-strong")} aria-hidden="true" />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">Submitted {fmtDateTime(d.submittedAt)}</span>
        </p>
        <dl className="space-y-3 text-sm">
          <div><dt className="font-semibold text-ink">What went well</dt><dd className="text-body">{d.wentWell}</dd></div>
          <div><dt className="font-semibold text-ink">What they asked</dt><dd className="text-body">{d.questionsAsked}</dd></div>
          <div><dt className="font-semibold text-ink">Anything you are unsure about</dt><dd className="text-body">{d.concerns || "Nothing noted."}</dd></div>
        </dl>
      </Panel>
    );
  }

  const field = (key: keyof Omit<Draft, "rating">, label: string, placeholder: string) => (
    <div>
      <label htmlFor={`debrief-${key}`} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <Textarea id={`debrief-${key}`} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} placeholder={placeholder} className="mt-1.5 min-h-[4.5rem] bg-mist focus:bg-white" />
    </div>
  );

  return (
    <Panel title="Two-minute debrief">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(draft);
        }}
      >
        <div>
          <p className="text-sm font-semibold text-ink">How did it feel?</p>
          <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Rating out of five">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={draft.rating === n}
                aria-label={`${n} out of 5`}
                onClick={() => setDraft({ ...draft, rating: n as Draft["rating"] })}
                className="flex size-9 items-center justify-center rounded-lg hover:bg-mist"
              >
                <Star className={cn("size-5", n <= draft.rating ? "fill-teal-600 text-teal-600" : "text-hairline-strong")} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        {field("wentWell", "What went well?", "The example that landed, the question you answered best…")}
        {field("questionsAsked", "What did they ask?", "Even a rough list helps Daniel prepare you for the next stage.")}
        {field("concerns", "Anything you are unsure about?", "Optional — a question you fumbled, a doubt about the role.")}
        <Button type="submit" size="sm" variant="accent" disabled={!draft.wentWell.trim()}>
          <Check aria-hidden="true" /> Send to Daniel
        </Button>
      </form>
    </Panel>
  );
}
