import { Check, ShieldCheck } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { TRANSPARENCY } from "@/constants/home-sections";

export function Transparency({ tone = "mist" }: { tone?: "paper" | "mist" }) {
  const t = TRANSPARENCY;
  return (
    <Section tone={tone} id="transparency" aria-labelledby="transparency-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
        <Reveal>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} titleId="transparency-title" />
          <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50 p-6">
            <ShieldCheck className="size-6 text-ink" aria-hidden="true" />
            <ul className="mt-3 space-y-2 font-display font-semibold text-ink">
              {t.statements.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="lg:pt-2">
          <p className="eyebrow mb-5">{t.provideIntro}</p>
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {t.provide.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl border border-hairline bg-white px-4 py-3 text-sm font-medium text-ink">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-1 border-l-2 border-teal-600 pl-4 font-display font-bold text-ink">
            {t.closing.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
