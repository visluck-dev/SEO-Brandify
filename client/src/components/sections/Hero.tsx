import { Link } from "wouter";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { DashboardMock } from "@/components/dashboard/DashboardMock";
import { CTA } from "@/constants/site";
import { HERO } from "@/constants/home";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="hero-title">
      {/* Soft teal glow + dot grid, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_163_165_/_0.16),transparent)]" />
      </div>

      <Container className="relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:pb-24 lg:pt-20">
        <div className="max-w-xl">
          <p className="eyebrow mb-5">{HERO.eyebrow}</p>
          <h1 id="hero-title" className="h-display text-ink">
            {HERO.title}
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-teal-700 md:text-2xl">{HERO.subtitle}</p>
          <p className="mt-5 text-base leading-relaxed text-body md:text-lg">{HERO.description}</p>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{HERO.tagline}</p>

          <div className="mt-8">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href={CTA.href}>{CTA.label}</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3" aria-label="Why candidates choose VisLuck">
            {HERO.proof.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="flex size-5 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <DashboardMock compact withToast className="lg:-mr-6 xl:mr-0" />
      </Container>
    </section>
  );
}
