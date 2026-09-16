import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Wordmark colour: navy on light surfaces, white on the navy footer. */
  tone?: "navy" | "white";
  /** Renders the tagline beneath the wordmark (footer only). */
  withTagline?: boolean;
}

/**
 * VisLuck brand lockup: a teal "V" mark next to the VISLUCK wordmark.
 * Pure SVG + text so it stays crisp at every size and needs no image request.
 */
export function Logo({ className, tone = "navy", withTagline = false }: LogoProps) {
  const wordmark = tone === "white" ? "text-white" : "text-ink";
  const tagline = tone === "white" ? "text-white/60" : "text-muted-foreground";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span translate="no" className={cn("font-display text-[1.15rem] font-extrabold uppercase tracking-[0.16em]", wordmark)}>
          VisLuck
        </span>
        {withTagline && (
          <span className={cn("mt-1.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.2em]", tagline)}>
            Where vision beats luck
          </span>
        )}
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <rect width="32" height="32" rx="9" fill="#0B1F3A" />
      <path d="M8.5 9.5 16 23l7.5-13.5" stroke="#14A3A5" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="23" r="2.1" fill="#E8F6F6" />
    </svg>
  );
}
