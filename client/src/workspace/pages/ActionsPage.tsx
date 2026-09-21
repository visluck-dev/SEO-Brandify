import { useState } from "react";
import { ListChecks } from "lucide-react";

import { fmtDate } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { EmptyState } from "../shell/EmptyState";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";
import { TaskRow } from "../shell/TaskRow";
import { cn } from "@/lib/utils";

export default function ActionsPage() {
  const { state } = useWorkspace();
  const [tab, setTab] = useState<"open" | "done">("open");
  const { open, done, consultantOpen } = state.tasks;
  const list = tab === "open" ? open : done;

  return (
    <div>
      <PageHeader
        title="Actions"
        description="Small, dated things only you can do — approving a CV, confirming a slot, a two-minute debrief. Everything else is on Daniel's list, and you can see that too."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Panel
          title="Your actions"
          count={open.length}
          bodyClassName="py-1 sm:py-1"
          action={
            <div className="flex rounded-lg bg-fog p-0.5" role="tablist" aria-label="Task state">
              {(["open", "done"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn("h-7 rounded-md px-3 font-display text-xs font-semibold capitalize transition-colors", tab === t ? "bg-white text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}
                >
                  {t} {t === "open" ? `(${open.length})` : `(${done.length})`}
                </button>
              ))}
            </div>
          }
        >
          {list.length ? (
            <ul className="divide-y divide-hairline">
              {list.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </ul>
          ) : (
            <EmptyState
              compact
              className="my-3"
              icon={ListChecks}
              title={tab === "open" ? "Nothing waiting on you" : "Nothing completed yet"}
              body={tab === "open" ? "When Daniel needs something — an approval, a confirmation, a debrief — it appears here with a date. Until then, the work is on his side." : "Completed actions stay here so you can see what you have done."}
              when={tab === "open" && consultantOpen[0] ? `Daniel's next step: ${fmtDate(consultantOpen[0].dueAt)}` : undefined}
            />
          )}
        </Panel>

        <Panel title="On Daniel's list" count={consultantOpen.length} bodyClassName="py-1 sm:py-1">
          {consultantOpen.length ? (
            <ul className="divide-y divide-hairline">
              {consultantOpen.map((t) => (
                <TaskRow key={t.id} task={t} dense />
              ))}
            </ul>
          ) : (
            <p className="py-3 text-sm text-body">Nothing scheduled — Daniel is working through this week's plan and logs the next follow-up dates as applications go out.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
