import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { MobileTabs } from "./MobileTabs";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface WorkspaceShellProps {
  /** Rendered above everything (the demo strip). Its height offsets the sticky bars. */
  banner?: ReactNode;
  children: ReactNode;
}

/** Sidebar + top bar + content on desktop; top bar + bottom tabs on phones. */
export function WorkspaceShell({ banner, children }: WorkspaceShellProps) {
  const [location] = useLocation();
  const reduce = useReducedMotion();
  const offset = banner ? "top-10" : "top-0";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-mist">
      <a
        href="#workspace-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-14 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      {banner}
      <div className="flex flex-1">
        <aside className={cn("sticky hidden w-64 shrink-0 self-start border-r border-hairline bg-white lg:block", offset, banner ? "h-[calc(100dvh-2.5rem)]" : "h-[100dvh]")}>
          <Sidebar />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar className={offset} />
          <motion.main
            key={location}
            id="workspace-main"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
      <MobileTabs />
    </div>
  );
}
