import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { HelmetProvider } from "react-helmet-async";

import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ROUTES } from "@/constants/site";
import Home from "@/pages/Home";

const Placeholder = lazy(() => import("@/pages/Placeholder"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/** Old employer-consultancy URLs that are still indexed → nearest new page. */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/about-visluck-hr-consultancy": ROUTES.about,
  "/hr-consultancy-services": ROUTES.services,
  "/contact-visluck": ROUTES.book,
  "/contact": ROUTES.book,
  "/manpower-recruitment-consultancy": ROUTES.home,
  "/hr-training-development": ROUTES.home,
  "/hr-process-streamlining": ROUTES.home,
  "/hr-analytics-solutions": ROUTES.home,
  "/client-testimonials": ROUTES.home,
  "/careers": ROUTES.home,
  "/hr-insights": ROUTES.home,
};

function ScrollManager() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
      <Switch>
        <Route path={ROUTES.home} component={Home} />
        <Route path={ROUTES.about}>{() => <Placeholder title="About Us" />}</Route>
        <Route path={ROUTES.services}>{() => <Placeholder title="Services" />}</Route>
        <Route path={ROUTES.howItWorks}>{() => <Placeholder title="How It Works" />}</Route>
        <Route path={ROUTES.why}>{() => <Placeholder title="Why VisLuck" />}</Route>
        <Route path={ROUTES.faqs}>{() => <Placeholder title="FAQs" />}</Route>
        <Route path={ROUTES.book}>{() => <Placeholder title="Book a Free Consultation" />}</Route>
        <Route path={ROUTES.privacy}>{() => <Placeholder title="Privacy Policy" />}</Route>
        <Route path={ROUTES.terms}>{() => <Placeholder title="Terms & Conditions" />}</Route>
        <Route path={ROUTES.cookies}>{() => <Placeholder title="Cookie Policy" />}</Route>
        <Route path={ROUTES.disclaimer}>{() => <Placeholder title="Disclaimer" />}</Route>
        {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from}>
            <Redirect to={to} replace />
          </Route>
        ))}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <ScrollManager />
        <SiteHeader />
        <main id="main" className="flex-1">
          <Router />
        </main>
        <SiteFooter />
      </div>
      <Toaster />
    </HelmetProvider>
  );
}
