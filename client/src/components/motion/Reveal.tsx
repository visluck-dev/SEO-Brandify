import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const parent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
}

/**
 * One-time fade + 8px rise when the block scrolls into view.
 * Below-the-fold only: never wrap above-the-fold content (LCP + ui-animation rule).
 * Honours prefers-reduced-motion by rendering static markup.
 */
export function Reveal({ stagger = false, delay = 0, className, children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={stagger ? parent : child}
      transition={{ delay }}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}

/** Child of a staggered <Reveal stagger>. */
export function RevealItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }
  return (
    <motion.div className={className} variants={child} {...(props as object)}>
      {children}
    </motion.div>
  );
}
