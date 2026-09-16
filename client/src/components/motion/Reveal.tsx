import { createElement } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const parent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

type Tag = "div" | "ul" | "ol" | "li" | "dl" | "section" | "article" | "figure";

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: Tag;
  /** Stagger direct <RevealItem> children instead of animating the wrapper as one block. */
  stagger?: boolean;
}

/**
 * One-time fade + 8px rise when the block scrolls into view.
 * Below-the-fold only: never wrap above-the-fold content (LCP + ui-animation rule).
 * Honours prefers-reduced-motion by rendering static markup.
 */
export function Reveal({ as = "div", stagger = false, children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, props, children);

  const Motion = motion[as] as typeof motion.div;
  return (
    <Motion
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={stagger ? parent : child}
      {...(props as object)}
    >
      {children}
    </Motion>
  );
}

/** Child of a staggered <Reveal stagger>. */
export function RevealItem({ as = "div", children, ...props }: Omit<RevealProps, "stagger">) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, props, children);

  const Motion = motion[as] as typeof motion.div;
  return (
    <Motion variants={child} {...(props as object)}>
      {children}
    </Motion>
  );
}
