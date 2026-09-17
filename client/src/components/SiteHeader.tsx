import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/layout/Container";
import { CTA, NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-[border-color,box-shadow] duration-200",
          scrolled ? "border-hairline shadow-[0_1px_0_0_rgb(11_31_58_/_0.04),0_8px_24px_-16px_rgb(11_31_58_/_0.18)]" : "border-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem] xl:gap-6">
          <Link href="/" aria-label="VisLuck home" className="rounded-lg">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-11 items-center whitespace-nowrap rounded-lg px-2.5 font-display text-[0.8125rem] font-semibold transition-colors duration-200 hover:bg-mist hover:text-ink xl:px-3 xl:text-sm",
                        active ? "text-teal-700" : "text-body",
                      )}
                    >
                      {link.label}
                      {active && (
                        <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-teal-600" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <Link href={CTA.href}>{CTA.label}</Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="!size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(22rem,88vw)] border-l-hairline p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="border-b border-hairline px-6 py-5">
                    <Logo />
                  </div>
                  <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                      {NAV_LINKS.map((link) => {
                        const active = isActive(link.href);
                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex min-h-12 items-center rounded-lg px-3 font-display text-base font-semibold transition-colors duration-200 hover:bg-mist",
                                active ? "bg-teal-50 text-teal-700" : "text-ink",
                              )}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                  <div className="border-t border-hairline p-4">
                    <Button asChild size="lg" className="w-full">
                      <Link href={CTA.href} onClick={() => setOpen(false)}>
                        {CTA.label}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  );
}
