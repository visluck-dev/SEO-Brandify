import { Section } from "@/components/layout/Section";
import { TRUST_BAR } from "@/constants/home";

export function TrustBar() {
  return (
    <Section tone="mist" compact aria-label="Trust indicators" className="border-y border-hairline">
      <p className="text-center font-display text-sm font-semibold text-ink md:text-base">{TRUST_BAR.title}</p>
      <dl className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-hairline">
        {TRUST_BAR.items.map((item) => (
          <div key={item.value} className="flex flex-col text-center sm:px-6">
            <dt className="order-2 mt-1 text-sm text-muted-foreground">{item.label}</dt>
            <dd className="order-1 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
