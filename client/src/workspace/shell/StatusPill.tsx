import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "../data/derive";
import { cn } from "@/lib/utils";

const VARIANT: Record<StatusTone, "neutral" | "progressing" | "scheduled" | "waiting" | "outline"> = {
  neutral: "neutral",
  progressing: "progressing",
  scheduled: "scheduled",
  waiting: "waiting",
  closed: "outline",
};

export function StatusPill({ tone, label, className }: { tone: StatusTone; label: string; className?: string }) {
  return (
    <Badge variant={VARIANT[tone]} className={cn("gap-1.5 px-2 py-0 text-[0.6875rem]", tone === "closed" && "text-muted-foreground", className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </Badge>
  );
}
