import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-display text-xs font-semibold leading-5 whitespace-nowrap",
  {
    variants: {
      variant: {
        teal: "bg-teal-50 text-teal-700",
        navy: "bg-navy-50 text-ink",
        neutral: "bg-status-neutral-tint text-status-neutral",
        progressing: "bg-status-progressing-tint text-status-progressing",
        waiting: "bg-status-waiting-tint text-status-waiting",
        scheduled: "bg-status-scheduled-tint text-status-scheduled",
        outline: "border border-hairline text-body",
      },
    },
    defaultVariants: {
      variant: "teal",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
