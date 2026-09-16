import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { DIFFERENTIATOR } from "@/constants/home";
import { cn } from "@/lib/utils";

export function Differentiator({ tone = "mist" }: { tone?: "paper" | "mist" }) {
  const d = DIFFERENTIATOR;
  return (
    <Section tone={tone} id="approach" aria-labelledby="diff-title">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 id="diff-title" className="h-section">
          {d.title}
        </h2>
        <p className="mt-3 font-display text-xl font-bold text-teal-700 md:text-2xl">{d.subtitle}</p>
      </Reveal>

      <Reveal className="mt-12 space-y-5">
        <FlowRow label={d.traditional.label} steps={d.traditional.steps} muted />
        <FlowRow label={d.visluck.label} steps={d.visluck.steps} />
      </Reveal>

      <Reveal>
        <p className="mt-10 text-center font-display text-lg font-bold text-ink">{d.closing}</p>
      </Reveal>
    </Section>
  );
}

function FlowRow({ label, steps, muted = false }: { label: string; steps: readonly string[]; muted?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6",
        muted ? "border-hairline bg-white/60" : "border-teal-100 bg-white shadow-card",
      )}
    >
      <p className={cn("font-display text-xs font-bold uppercase tracking-[0.12em]", muted ? "text-muted-foreground" : "text-teal-700")}>{label}</p>
      <ol className="mt-4 flex flex-wrap items-center gap-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center">
            <span
              className={cn(
                "rounded-full px-3.5 py-1.5 font-display text-sm font-semibold",
                muted ? "bg-fog text-muted-foreground" : "bg-ink text-white",
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight className={cn("mx-2 size-4 shrink-0", muted ? "text-hairline-strong" : "text-teal-600")} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
