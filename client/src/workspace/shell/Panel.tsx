import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  count?: number;
  /** "View all" style link in the header. */
  link?: { href: string; label: string };
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/** White card with a hairline border — the workspace's basic surface. */
export function Panel({ title, count, link, action, className, bodyClassName, children }: PanelProps) {
  return (
    <section className={cn("rounded-2xl border border-hairline bg-white shadow-card", className)} aria-label={title}>
      {(title || link || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3 sm:px-5">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            {title}
            {typeof count === "number" && <span className="tabular rounded-full bg-fog px-1.5 text-[0.6875rem] font-bold leading-5 text-body">{count}</span>}
          </h3>
          {link && (
            <Link href={link.href} className="inline-flex items-center gap-1 rounded-md font-display text-xs font-semibold text-teal-700 hover:underline">
              {link.label} <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
          {action}
        </header>
      )}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
