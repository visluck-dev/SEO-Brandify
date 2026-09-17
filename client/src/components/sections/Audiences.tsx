import { Award, Globe, GraduationCap, Route } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { AUDIENCES, AUDIENCES_SECTION } from "@/constants/why";

const icons = { Award, Globe, GraduationCap, Route } as const;

export function Audiences({ tone = "paper" }: { tone?: "paper" | "mist" }) {
  return (
    <Section tone={tone} id="who-we-support" aria-labelledby="audiences-title">
      <SectionHeader eyebrow={AUDIENCES_SECTION.eyebrow} title={AUDIENCES_SECTION.title} titleId="audiences-title" />
      <Reveal as="ul" stagger className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {AUDIENCES.map((a) => {
          const Icon = icons[a.icon];
          return (
            <RevealItem as="li" key={a.title} className="rounded-2xl border border-hairline bg-white p-6 shadow-card transition-[box-shadow,border-color] duration-150 ease-out hover:border-hairline-strong hover:shadow-hover">
              <span className="flex size-11 items-center justify-center rounded-lg bg-navy-50 text-ink">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{a.description}</p>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}
