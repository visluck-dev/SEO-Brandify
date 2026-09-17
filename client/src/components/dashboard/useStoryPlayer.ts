import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { SCENE_DURATION_MS, STORY_SCENES } from "@/constants/dashboard-story";

/** Base dashboard shown before the first scene plays (after the hero entrance). */
const PREROLL_MS = 1800;

/**
 * Drives the hero dashboard story: auto-advances scenes, pauses on hover/focus,
 * when the panel is off-screen or the tab is hidden, and stops for good once
 * the visitor picks a scene themselves. Reduced motion never auto-plays.
 */
export function useStoryPlayer() {
  const reduce = useReducedMotion();
  // -1 = base state; the first scene plays in after the hero entrance (reduced motion starts on scene 0).
  const [scene, setScene] = useState(reduce ? 0 : -1);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const playing = autoplay && !reduce && !hovering && !focused && visible && !tabHidden;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setScene((s) => (s + 1) % STORY_SCENES.length), scene < 0 ? PREROLL_MS : SCENE_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [playing, scene]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const select = useCallback((index: number) => {
    setScene(index);
    setAutoplay(false);
  }, []);

  const bind = {
    ref,
    onPointerEnter: () => setHovering(true),
    onPointerLeave: () => setHovering(false),
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
    },
  };

  return { scene, select, playing, autoplay, bind };
}
