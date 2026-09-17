import { useMemo } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import { DASHBOARD_SAMPLE } from "@/constants/dashboard";
import { SCENE_DURATION_MS, STORY_SCENES, storyState } from "@/constants/dashboard-story";
import { cn } from "@/lib/utils";
import { LiveDashboardPanel } from "./LiveDashboardPanel";
import { useStoryPlayer } from "./useStoryPlayer";

/**
 * Hero visual: the candidate dashboard playing a four-scene story of the service at work,
 * with scene tabs the visitor can drive. Pauses on hover/focus, off-screen and in hidden tabs.
 */
export function LiveDashboard({ className }: { className?: string }) {
  const { scene, select, playing, autoplay, bind } = useStoryPlayer();
  const state = useMemo(() => storyState(scene), [scene]);
  const active = scene >= 0 ? STORY_SCENES[scene] : null;

  return (
    <MotionConfig reducedMotion="user">
      <figure className={cn("relative", className)}>
        <div {...bind} className="relative">
          <LiveDashboardPanel state={state} scene={scene} />
        </div>

        <div className="mt-5" role="group" aria-label="Dashboard walkthrough">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {STORY_SCENES.map((s, i) => {
              const isActive = i === scene;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => select(i)}
                  className={cn(
                    "relative min-h-11 whitespace-nowrap rounded-lg px-1.5 pb-2.5 pt-2 text-left font-display text-[0.625rem] font-bold uppercase tracking-[0.06em] transition-colors duration-200 hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-2 sm:text-xs sm:tracking-[0.1em]",
                    isActive ? "text-teal-700" : "text-muted-foreground",
                  )}
                >
                  <span className="mr-1.5 hidden tabular text-[0.625rem] text-muted-foreground/70 sm:inline">0{i + 1}</span>
                  {s.label}
                  <span aria-hidden="true" className="absolute inset-x-2 bottom-1 h-0.5 overflow-hidden rounded-full bg-fog">
                    <span
                      key={`${scene}-${playing}`}
                      className={cn("block h-full origin-left bg-teal-600", isActive && autoplay && "story-progress", isActive && !playing && "[animation-play-state:paused]")}
                      style={isActive && !autoplay ? { transform: "scaleX(1)" } : !isActive ? { transform: "scaleX(0)" } : undefined}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 flex min-h-5 items-center justify-between gap-4 px-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active?.id ?? "base"}
                className="text-xs font-medium text-body"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {active?.caption ?? "Your week, at a glance."}
              </motion.p>
            </AnimatePresence>
            <figcaption className="shrink-0 text-[0.6875rem] text-muted-foreground">{DASHBOARD_SAMPLE.caption}</figcaption>
          </div>
          <p className="sr-only">
            The walkthrough advances automatically every {SCENE_DURATION_MS / 1000} seconds. Hover or focus the dashboard to pause it, or choose a step.
          </p>
        </div>
      </figure>
    </MotionConfig>
  );
}
