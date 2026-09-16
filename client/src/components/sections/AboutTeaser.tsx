import { Link } from "wouter";
import { ArrowRight, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ABOUT, EXPERIENCE } from "@/constants/home";
import { ROUTES } from "@/constants/site";
import { cn } from "@/lib/utils";

interface AboutTeaserProps {
  /** Full variant renders every paragraph; compact keeps the first two and links to /about. */
  variant?: "compact" | "full";
  /** Hide the section header when a PageIntro already carries the title. */
  showHeader?: boolean;
}

export function AboutTeaser({ variant = "compact", showHeader = true }: AboutTeaserProps) {
  const paragraphs = variant === "full" ? ABOUT.paragraphs : ABOUT.paragraphs.slice(0, 2);

  return (
    <Section tone="mist" aria-labelledby={showHeader ? "about-title" : undefined} aria-label={showHeader ? undefined : "About VisLuck"}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal>
          {showHeader && <SectionHeader eyebrow={ABOUT.eyebrow} title={ABOUT.title} titleId="about-title" />}
          <div className={cn("prose-measure space-y-4 leading-relaxed text-body", showHeader ? "mt-8" : "text-lg")}>
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {variant === "compact" && (
            <Button asChild variant="link" size="lg" className="mt-6 px-0">
              <Link href={ROUTES.about}>
                More about VisLuck <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </Reveal>

        <Reveal className="space-y-6">
          <figure className="rounded-3xl border border-hairline bg-white p-7 shadow-card md:p-8">
            <Quote className="size-6 text-teal-600" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{ABOUT.philosophyIntro}</p>
            <blockquote className="mt-3 font-display text-xl font-bold leading-snug text-ink md:text-2xl">{ABOUT.philosophy}</blockquote>
          </figure>

          <div className="rounded-3xl border border-hairline bg-white p-7 shadow-card md:p-8">
            <p className="font-display text-3xl font-extrabold tracking-tight text-ink">{EXPERIENCE.stat.split(" of ")[0]}</p>
            <p className="mt-1 text-sm text-muted-foreground">of combined experience across</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {EXPERIENCE.areas.map((a) => (
                <li key={a} className="rounded-full bg-teal-50 px-3 py-1.5 font-display text-xs font-semibold text-teal-700">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
