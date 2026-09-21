import { Link } from "wouter";
import { Check, Play } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { LiveDashboard } from "@/components/dashboard/LiveDashboard";
import { CTA, ROUTES } from "@/constants/site";
import { HERO } from "@/constants/home";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Copy column: children rise in one after another (90ms apart). */
const copy: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Dashboard panel: settles into place slightly after the headline. */
const panel: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE, delay: 0.25 } },
};

export function Hero() {
  const reduce = useReducedMotion();
  // With reduced motion, initial={false} renders the final state instantly (no travel).
  const initial = reduce ? false : "hidden";

  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="hero-title">
      {/* Soft teal glow + dot grid, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_163_165_/_0.16),transparent)]" />
      </div>

      <Container className="relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:pb-24 lg:pt-20">
        <motion.div className="max-w-xl" variants={copy} initial={initial} animate="show">
          <motion.p variants={rise} className="eyebrow mb-5">
            {HERO.eyebrow}
          </motion.p>
          <motion.h1 variants={rise} id="hero-title" className="h-display text-ink">
            {HERO.title}
          </motion.h1>
          <motion.p variants={rise} className="mt-5 font-display text-xl font-bold text-teal-700 md:text-2xl">
            {HERO.subtitle}
          </motion.p>
          <motion.p variants={rise} className="mt-5 text-base leading-relaxed text-body md:text-lg">
            {HERO.description}
          </motion.p>
          <motion.p variants={rise} className="mt-4 text-sm font-medium text-muted-foreground">
            {HERO.tagline}
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href={CTA.href}>{CTA.label}</Link>
            </Button>
            <Button asChild size="xl" variant="ghost" className="w-full sm:w-auto">
              <Link href={ROUTES.demo}>
                <Play aria-hidden="true" /> Try the dashboard
              </Link>
            </Button>
          </motion.div>

          <motion.ul variants={rise} className="mt-8 flex flex-wrap gap-x-6 gap-y-3" aria-label="Why candidates choose VisLuck">
            {HERO.proof.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="flex size-5 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div variants={panel} initial={initial} animate="show" className="lg:-mr-6 xl:mr-0">
          <LiveDashboard />
        </motion.div>
      </Container>
    </section>
  );
}
