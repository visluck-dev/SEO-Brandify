import { Link } from "wouter";
import { ArrowRight, Check, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Task } from "../data/types";
import { dueLabel, fmtDate } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

const TONE: Record<ReturnType<typeof dueLabel>["tone"], string> = {
  overdue: "text-destructive",
  today: "text-teal-700",
  soon: "text-body",
  later: "text-muted-foreground",
};

/** Where the task's primary action lives; tasks close themselves when that action completes. */
function primaryAction(task: Task): { label: string; href: string } | null {
  switch (task.kind) {
    case "approve-cv":
      return { label: "Review", href: WS.documents };
    case "prep":
      return { label: "Open prep kit", href: task.interviewId ? WS.interview(task.interviewId) : WS.interviews };
    case "debrief":
      return { label: "Start debrief", href: task.interviewId ? `${WS.interview(task.interviewId)}#debrief` : WS.interviews };
    case "review-opportunities":
      return { label: "Review", href: WS.opportunities };
    case "confirm-interview":
      return task.interviewId ? { label: "View", href: WS.interview(task.interviewId) } : null;
    default:
      return null;
  }
}

interface TaskRowProps {
  task: Task;
  showApplication?: boolean;
  dense?: boolean;
}

export function TaskRow({ task, showApplication = true, dense = false }: TaskRowProps) {
  const { state, data } = useWorkspace();
  const done = !!task.completedAt;
  const due = dueLabel(task.dueAt, state.now);
  const action = primaryAction(task);
  const app = task.applicationId ? state.applications.find((a) => a.id === task.applicationId) : undefined;
  const canTick = task.kind === "custom" || task.kind === "check-in" || task.kind === "prep";
  const confirm = task.kind === "confirm-interview" && task.interviewId;

  return (
    <li className={cn("flex items-start gap-3", dense ? "py-2.5" : "py-3")}>
      {done ? (
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden="true" />
      ) : canTick ? (
        <button
          type="button"
          onClick={() => data.completeTask(task.id)}
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-hairline-strong text-transparent transition-colors hover:border-teal-600 hover:text-teal-600"
          aria-label={`Mark "${task.title}" as done`}
        >
          <Check className="size-3" strokeWidth={3} />
        </button>
      ) : (
        <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-hairline-strong" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("font-display text-sm font-semibold", done ? "text-muted-foreground line-through decoration-hairline-strong" : "text-ink")}>{task.title}</p>
        {!dense && task.detail && !done && <p className="mt-0.5 text-sm leading-relaxed text-body">{task.detail}</p>}
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs">
          {done ? (
            <span className="text-muted-foreground">Done {fmtDate(task.completedAt!)}</span>
          ) : (
            <span className={cn("font-semibold", TONE[due.tone])}>{due.label}</span>
          )}
          {showApplication && app && (
            <>
              <span className="text-hairline-strong" aria-hidden="true">·</span>
              <Link href={WS.application(app.id)} className="font-medium text-teal-700 hover:underline">
                {app.company}
              </Link>
            </>
          )}
        </p>
      </div>
      {!done && confirm && (
        <Button size="sm" variant="accent" onClick={() => data.confirmInterview(task.interviewId!)}>
          Confirm
        </Button>
      )}
      {!done && !confirm && action && (
        <Button asChild size="sm" variant="outline">
          <Link href={action.href}>
            {action.label} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      )}
    </li>
  );
}
