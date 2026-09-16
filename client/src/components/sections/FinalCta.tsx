import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FINAL_CTA } from "@/constants/home-sections";
import { CTA } from "@/constants/site";

/** The one navy surface on the site (DESIGN.md section 5): a contained panel above the footer. */
export function FinalCta() {
  return (
    <Section tone="paper" aria-labelledby="final-cta-title" className="pt-0 md:pt-0">
      <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-10 md:px-14 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_163_165_/_0.3),transparent)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-20 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(closest-side,rgb(27_58_107_/_0.9),transparent)]" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
          <div>
            <h2 id="final-cta-title" className="h-section text-white">
              {FINAL_CTA.title}
            </h2>
            <div className="mt-6 max-w-xl space-y-2 text-lg text-white/75">
              {FINAL_CTA.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
          <div className="lg:justify-self-end lg:text-right">
            <Button asChild variant="on-navy" size="xl" className="w-full sm:w-auto">
              <Link href={CTA.href}>{CTA.label}</Link>
            </Button>
            <p className="mt-4 text-sm text-white/60">{FINAL_CTA.footnote}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

