import { Link } from "wouter";
import { Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { SHOW_TESTIMONIALS, TESTIMONIALS, TESTIMONIALS_SECTION } from "@/constants/testimonials";
import { CTA } from "@/constants/site";

/** Hidden until SHOW_TESTIMONIALS is true and real, attributable quotes replace the placeholders. */
export function Testimonials({ tone = "paper" }: { tone?: "paper" | "mist" }) {
  if (!SHOW_TESTIMONIALS) return null;

  return (
    <Section tone={tone} id="testimonials" aria-labelledby="testimonials-title">
      <SectionHeader eyebrow={TESTIMONIALS_SECTION.eyebrow} title={TESTIMONIALS_SECTION.title} align="center" titleId="testimonials-title" />
      <Reveal as="ul" stagger className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <RevealItem as="li" key={t.quote} className="flex flex-col rounded-2xl border border-hairline bg-white p-7 shadow-card">
            <Quote className="size-6 text-teal-600" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 leading-relaxed text-body">{t.quote}</blockquote>
            <p className="mt-6 font-display font-bold text-ink">{t.name}</p>
            <p className="text-sm text-muted-foreground">{t.role}</p>
          </RevealItem>
        ))}
      </Reveal>
      <div className="mt-12 text-center">
        <p className="font-display text-lg font-bold text-ink">{TESTIMONIALS_SECTION.ctaLead}</p>
        <Button asChild size="lg" className="mt-5">
          <Link href={CTA.href}>{CTA.label}</Link>
        </Button>
      </div>
    </Section>
  );
}
