import { ArrowRight } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { PROBLEM } from "@/constants/home";
import { cn } from "@/lib/utils";

export function Problem() {
  return (
    <Section tone="paper" aria-labelledby="problem-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <SectionHeader eyebrow="The problem" title={PROBLEM.title} titleId="problem-title" />
          <ol className="mt-8 space-y-1 border-l-2 border-hairline pl-6" aria-label="A typical job search">
            {PROBLEM.sequence.map((line, i) => {
              const last = i === PROBLEM.sequence.length - 1;
              return (
                <li key={line} className={cn("relative py-1.5 font-display text-lg", last ? "font-bold text-ink" : "font-medium text-muted-foreground")}>
                  <span aria-hidden="true" className={cn("absolute -left-[1.85rem] top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-white", last ? "bg-teal-600" : "bg-hairline-strong")} />
                  {line}
                </li>
              );
            })}
          </ol>
          <p className="mt-8 max-w-lg leading-relaxed text-body">{PROBLEM.body}</p>
          <p className="mt-4 font-display text-lg font-bold text-ink">{PROBLEM.resolution}</p>
        </div>

        <div className="lg:pt-14">
          <p className="eyebrow mb-4">{PROBLEM.intro}</p>
          <Reveal as="ul" stagger className="divide-y divide-hairline rounded-2xl border border-hairline bg-white shadow-card">
            {PROBLEM.shifts.map((s) => (
              <RevealItem as="li" key={s.to} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 sm:gap-5 sm:px-6">
                  <span className="text-sm font-medium text-muted-foreground line-through decoration-hairline-strong sm:text-base">{s.from}</span>
                  <span className="flex size-8 items-center justify-center rounded-full bg-teal-50 text-teal-700" aria-hidden="true">
                    <ArrowRight className="size-4" />
                  </span>
                  <span className="font-display text-sm font-bold text-ink sm:text-base">{s.to}</span>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
