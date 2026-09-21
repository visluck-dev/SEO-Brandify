import { Link } from "wouter";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { relativeTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

/** The human behind the workspace: name, face, reply promise, last activity. */
export function ConsultantCard({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { state } = useWorkspace();
  const c = state.consultant;
  return (
    <div className={cn("rounded-xl border border-hairline bg-white", compact ? "p-3" : "p-4", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-100 font-display text-sm font-bold text-ink" aria-hidden="true">
          {c.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold text-ink">{c.name}</p>
          <p className="truncate text-xs text-muted-foreground">{compact ? c.title : `${c.title} · your consultant`}</p>
        </div>
      </div>
      <dl className="mt-3 space-y-1 text-xs text-body">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Reply time</dt>
          <dd className="font-medium">{c.replySla.replace("Replies within ", "")}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Last active</dt>
          <dd className="font-medium">{relativeTime(c.lastActiveAt, state.now)}</dd>
        </div>
      </dl>
      {!compact && (
        <Button asChild variant="outline" size="sm" className="mt-3 w-full">
          <Link href={WS.messages}>
            <MessageSquare aria-hidden="true" /> Message {c.name.split(" ")[0]}
          </Link>
        </Button>
      )}
    </div>
  );
}
