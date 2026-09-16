import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { CTA } from "@/constants/site";
import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Show the primary CTA under the lead. */
  withCta?: boolean;
  className?: string;
}

/** Sub-page opener: eyebrow, display heading and lead on the hero treatment. */
export function PageIntro({ eyebrow, title, lead, withCta = false, className }: PageIntroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-hairline bg-white", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_163_165_/_0.14),transparent)]" />
      </div>
      <Container className="relative py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="h-display">{title}</h1>
          {lead && <p className="lead mt-6 max-w-2xl">{lead}</p>}
          {withCta && (
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={CTA.href}>{CTA.label}</Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
