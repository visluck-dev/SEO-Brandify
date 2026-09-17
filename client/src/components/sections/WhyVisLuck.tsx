import {
  BriefcaseBusiness,
  Eye,
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  MapPinned,
  UserRoundCog,
} from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { WHY_REASONS, WHY_SECTION } from "@/constants/why";

const icons = { BriefcaseBusiness, UserRoundCog, MapPinned, Eye, LayoutDashboard, HeartHandshake, ListChecks } as const;

/** Divider-based feature list (no floating cards) — DESIGN.md section 5. */
export function WhyVisLuck({ tone = "paper" }: { tone?: "paper" | "mist" }) {
  return (
    <Section tone={tone} id="why-visluck" aria-labelledby="why-title">
      <SectionHeader eyebrow={WHY_SECTION.eyebrow} title={WHY_SECTION.title} align="center" titleId="why-title" />
      <Reveal as="ul" stagger className="mt-12 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4">
        {WHY_REASONS.map((r) => {
          const Icon = icons[r.icon];
          return (
            <RevealItem as="li" key={r.title} className="border-t border-hairline py-7">
              <span className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{r.description}</p>
            </RevealItem>
          );
        })}
        <li className="border-t border-hairline py-7">
          <p className="font-display text-lg font-bold leading-snug text-ink">Technology tracks the process.</p>
          <p className="font-display text-lg font-bold leading-snug text-teal-700">Our people support the candidate.</p>
        </li>
      </Reveal>
    </Section>
  );
}
