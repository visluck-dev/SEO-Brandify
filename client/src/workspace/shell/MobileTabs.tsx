import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Ellipsis } from "lucide-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useWorkspace } from "../data/WorkspaceContext";
import { cn } from "@/lib/utils";
import { isNavActive, NAV } from "./nav";
import { Sidebar } from "./Sidebar";

/** Bottom tab bar for phones: the four daily screens plus "More". */
export function MobileTabs() {
  const [location] = useLocation();
  const [more, setMore] = useState(false);
  const { state } = useWorkspace();
  const primary = NAV.filter((n) => n.primary);
  const moreActive = !primary.some((n) => isNavActive(n.href, location));

  const tab = "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 font-display text-[0.6875rem] font-semibold";

  return (
    <>
      <nav aria-label="Workspace tabs" className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="flex">
          {primary.map((item) => {
            const active = isNavActive(item.href, location);
            const count = item.badge?.(state) ?? 0;
            return (
              <li key={item.href} className="flex flex-1">
                <Link href={item.href} aria-current={active ? "page" : undefined} className={cn(tab, active ? "text-teal-700" : "text-muted-foreground")}>
                  <span className="relative">
                    <item.icon className="size-5" aria-hidden="true" />
                    {count > 0 && (
                      <span className="tabular absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-700 px-1 text-[0.625rem] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex flex-1">
            <button type="button" onClick={() => setMore(true)} className={cn(tab, moreActive ? "text-teal-700" : "text-muted-foreground")} aria-haspopup="dialog">
              <Ellipsis className="size-5" aria-hidden="true" />
              More
            </button>
          </li>
        </ul>
      </nav>
      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t-hairline p-0">
          <SheetTitle className="sr-only">All sections</SheetTitle>
          <Sidebar onNavigate={() => setMore(false)} className="max-h-[80dvh]" />
        </SheetContent>
      </Sheet>
    </>
  );
}
