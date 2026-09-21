import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/** Counts from the previous value to `value` in 600ms (instant under reduced motion). */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    if (reduce || from === value) {
      setShown(value);
      return;
    }
    const controls = animate(from, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    // Background tabs pause requestAnimationFrame; make sure the final value still lands.
    const settle = window.setTimeout(() => setShown(value), 700);
    return () => {
      controls.stop();
      window.clearTimeout(settle);
    };
  }, [value, reduce]);

  return <span className={className}>{shown}</span>;
}
