import { Link } from "wouter";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/Section";
import { DashboardMock } from "@/components/dashboard/DashboardMock";
import { DASHBOARD_SECTION } from "@/constants/home-sections";
import { ROUTES } from "@/constants/site";

export function DashboardShowcase({ tone = "paper" }: { tone?: "paper" | "mist" }) {
  const d = DASHBOARD_SECTION;
  return (
    <Section tone={tone} id="dashboard" aria-labelledby="dashboard-title" className="overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
        <div>
          <SectionHeader eyebrow={d.eyebrow} title={d.title} titleId="dashboard-title" />
        </div>
        <div>
          <ul className="space-y-0.5 font-display text-lg font-semibold text-muted-foreground">
            {d.noMore.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{d.quote}</p>
          <p className="mt-5 max-w-md leading-relaxed text-body">{d.body}</p>
        </div>
      </div>

      <div className="mt-12">
        <DashboardMock className="mx-auto max-w-5xl" />
      </div>

      <div className="mt-16 grid gap-10 border-t border-hairline pt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="eyebrow mb-5">{d.canShowIntro}</p>
          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.metrics.map((m) => (
              <div key={m.label} className="border-l-2 border-teal-600 pl-4">
                <dt className="font-display font-bold text-ink">{m.label}</dt>
                <dd className="mt-1 text-sm text-body">{m.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className="eyebrow mb-5">{d.visibilityIntro}</p>
          <ul className="flex flex-wrap gap-2">
            {d.columns.map((c) => (
              <li key={c} className="rounded-lg border border-hairline bg-white px-3 py-1.5 font-display text-sm font-semibold text-ink">
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-display text-xl font-bold text-ink">{d.closing}</p>
          <Button asChild size="lg" variant="outline" className="mt-6">
            <Link href={ROUTES.demo}>
              <Play aria-hidden="true" /> Try the dashboard with sample data
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
