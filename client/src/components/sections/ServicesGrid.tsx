import { Link } from "wouter";
import { ArrowRight, Check, Compass, FileText, LifeBuoy, Linkedin, MessagesSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { SERVICES, SERVICES_SECTION, type Service } from "@/constants/services";
import { ROUTES } from "@/constants/site";
import { cn } from "@/lib/utils";

const icons = { FileText, Linkedin, Compass, Send, MessagesSquare, LifeBuoy } as const;

interface ServicesGridProps {
  variant?: "compact" | "full";
  tone?: "paper" | "mist";
  /** Hide the section header when a PageIntro already carries the title. */
  showHeader?: boolean;
}

/** 2 featured + 4 compact tiles: an asymmetric bento rather than equal cards. */
export function ServicesGrid({ variant = "compact", tone = "paper", showHeader = true }: ServicesGridProps) {
  return (
    <Section tone={tone} id="services" aria-labelledby={showHeader ? "services-title" : undefined} aria-label={showHeader ? undefined : "Services"}>
      {showHeader && (
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow={SERVICES_SECTION.eyebrow} title={SERVICES_SECTION.title} titleId="services-title" />
          {variant === "compact" && (
            <Button asChild variant="outline" size="lg" className="shrink-0">
              <Link href={ROUTES.services}>
                Explore all services <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      )}

      <Reveal as="ul" stagger className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-4", showHeader && "mt-12")}>
        {SERVICES.map((s) => (
          <ServiceTile key={s.id} service={s} full={variant === "full"} />
        ))}
      </Reveal>
    </Section>
  );
}

function ServiceTile({ service, full }: { service: Service; full: boolean }) {
  const Icon = icons[service.icon];
  const points = full || service.featured ? service.points : service.points.slice(0, 3);

  return (
    <RevealItem
      as="li"
      id={service.id}
      className={cn(
        "group flex scroll-mt-28 flex-col rounded-2xl border border-hairline bg-white p-6 shadow-card transition-[box-shadow,border-color] duration-150 ease-out hover:border-hairline-strong hover:shadow-hover md:p-7",
        service.featured && "xl:col-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="font-display text-sm font-bold tracking-[0.12em] text-muted-foreground">{service.number}</span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-ink">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body md:text-base">{service.description}</p>
      <ul className={cn("mt-5 gap-x-6 gap-y-2", service.featured ? "grid sm:grid-cols-2" : "space-y-2")}>
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-body">
            <Check className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </RevealItem>
  );
}
