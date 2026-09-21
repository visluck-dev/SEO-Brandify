import { Link } from "wouter";
import { LogOut, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CTA } from "@/constants/site";
import { SCENARIOS, type ScenarioId } from "../data/mock/journey";
import { WS } from "../routes";
import { cn } from "@/lib/utils";

interface DemoBarProps {
  scenario: ScenarioId;
  onChange: (id: ScenarioId) => void;
}

/**
 * Always-visible strip that says this is sample data and lets the visitor move
 * the sample search between three moments. Links with "~/" leave the /demo base.
 */
export function DemoBar({ scenario, onChange }: DemoBarProps) {
  const current = SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[1];
  return (
    <div className="sticky top-0 z-50 h-10 bg-ink text-white">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-3 px-3 sm:px-4">
        <p className="hidden min-w-0 items-center gap-2 text-xs font-medium text-white/80 md:flex">
          <span className="size-1.5 rounded-full bg-teal-500" aria-hidden="true" />
          <span className="truncate">Sample workspace · fictional candidate, fictional employers</span>
        </p>

        <div className="flex items-center gap-2 md:mx-auto" role="group" aria-label="Moment in the sample search">
          <label htmlFor="demo-scenario" className="text-xs font-semibold text-white/80 md:hidden">
            Viewing
          </label>
          <select
            id="demo-scenario"
            value={scenario}
            onChange={(e) => onChange(e.target.value as ScenarioId)}
            className="h-7 rounded-md border border-white/20 bg-navy-800 px-2 text-xs font-semibold text-white md:hidden"
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="hidden rounded-lg bg-white/10 p-0.5 md:flex">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange(s.id)}
                aria-pressed={s.id === scenario}
                title={s.description}
                className={cn(
                  "h-7 rounded-md px-3 font-display text-xs font-semibold transition-colors duration-150",
                  s.id === scenario ? "bg-white text-ink" : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Link href={WS.start} className="hidden h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-teal-100 hover:bg-white/10 lg:inline-flex">
            <Play className="size-3.5" aria-hidden="true" /> Replay first run
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button asChild variant="on-navy" size="sm" className="hidden h-7 px-3 text-xs sm:inline-flex">
            <Link href={`~${CTA.href}`}>{CTA.label}</Link>
          </Button>
          <Link href="~/" className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white" aria-label="Exit the demo">
            <LogOut className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Exit</span>
          </Link>
        </div>
      </div>
      <span className="sr-only">{current.description}</span>
    </div>
  );
}
