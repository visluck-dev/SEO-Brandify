import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { HOW_IT_WORKS, STEPS } from "@/constants/steps";
import { CTA, ROUTES } from "@/constants/site";

interface HowItWorksProps {
  variant?: "compact" | "full";
  tone?: "paper" | "mist";
}

export function HowItWorks({ variant = "compact", tone = "mist" }: HowItWorksProps) {
  if (variant === "full") return <Timeline tone={tone} />;

  return (
    <Section tone={tone} id="how-it-works" aria-labelledby="how-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader eyebrow={HOW_IT_WORKS.eyebrow} title={HOW_IT_WORKS.title} titleId="how-title" />
        <Button asChild variant="outline" size="lg" className="shrink-0">
          <Link href={ROUTES.howItWorks}>
            See the full journey <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <Reveal as="ol" stagger className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step) => (
          <RevealItem as="li" key={step.number} className="rounded-2xl border border-hairline bg-white p-6 shadow-card">
            <span className="font-display text-sm font-bold tracking-[0.12em] text-teal-700">{step.number}</span>
            <h3 className="mt-3 text-lg font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{step.description}</p>
          </RevealItem>
        ))}
        <li className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-white">
          <p className="font-display text-lg font-bold leading-snug">Ready for step one?</p>
          <Button asChild variant="on-navy" size="md" className="mt-6 w-full">
            <Link href={CTA.href}>{CTA.label}</Link>
          </Button>
        </li>
      </Reveal>
    </Section>
  );
}

/** Full-page variant: sticky heading column + vertical timeline. */
function Timeline({ tone }: { tone: "paper" | "mist" }) {
  return (
    <Section tone={tone} id="how-it-works" aria-labelledby="how-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow={HOW_IT_WORKS.eyebrow} title={HOW_IT_WORKS.title} titleId="how-title" />
          <p className="lead mt-6">Seven clear stages. Every stage has a defined next step, and you can see where you are at any time.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href={CTA.href}>{CTA.label}</Link>
          </Button>
        </div>

        <ol className="relative border-l-2 border-hairline pl-8 sm:pl-10">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.number} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[calc(2rem+0.0625rem+1.25rem)] top-0.5 flex size-10 items-center justify-center rounded-full border-2 border-white bg-teal-700 font-display text-xs font-bold text-white shadow-card sm:-left-[calc(2.5rem+0.0625rem+1.25rem)]"
              >
                {step.number}
              </span>
              <h3 className="text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 max-w-lg leading-relaxed text-body">{step.description}</p>
              {i === STEPS.length - 1 && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 font-display text-xs font-semibold text-teal-700">
                  Support continues after this step
                </p>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
