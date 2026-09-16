import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { METRICS, METRICS_SECTION, SHOW_METRICS } from "@/constants/metrics";

/** Operational metrics strip. Hidden until real values are supplied (SHOW_METRICS). */
export function Metrics({ tone = "mist" }: { tone?: "paper" | "mist" }) {
  if (!SHOW_METRICS) return null;

  return (
    <Section tone={tone} compact id="results" aria-labelledby="metrics-title">
      <SectionHeader eyebrow={METRICS_SECTION.eyebrow} title={METRICS_SECTION.title} align="center" titleId="metrics-title" />
      <Reveal as="dl" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-hairline">
        {METRICS.map((m) => (
          <div key={m.label} className="flex flex-col text-center lg:px-6">
            <dd className="tabular order-1 font-display text-4xl font-extrabold tracking-tight text-ink">{m.value || "—"}</dd>
            <dt className="order-2 mt-2 text-sm text-muted-foreground">{m.label}</dt>
          </div>
        ))}
      </Reveal>
      {METRICS_SECTION.asOf && <p className="mt-6 text-center text-xs text-muted-foreground">{METRICS_SECTION.asOf}</p>}
    </Section>
  );
}
