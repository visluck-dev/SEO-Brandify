import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ROUTES } from "@/constants/site";
import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const WhyVisLuck = lazy(() => import("@/pages/WhyVisLuck"));
const Faqs = lazy(() => import("@/pages/Faqs"));
const BookConsultation = lazy(() => import("@/pages/BookConsultation"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const LegalPage = lazy(() => import("@/pages/legal/LegalPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const WorkspaceRoot = lazy(() => import("@/workspace"));

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

/** Routes that render the product shell instead of the marketing header and footer. */
const WORKSPACE_PREFIXES = [ROUTES.demo, ROUTES.ops];

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

/** Each route enters with a short fade + 6px rise (instant under reduced motion). */
function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={location}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
      <Switch>
        <Route path={ROUTES.home} component={Home} />
        <Route path={ROUTES.about} component={About} />
        <Route path={ROUTES.services} component={Services} />
        <Route path={ROUTES.howItWorks} component={HowItWorks} />
        <Route path={ROUTES.why} component={WhyVisLuck} />
        <Route path={ROUTES.faqs} component={Faqs} />
        <Route path={ROUTES.book} component={BookConsultation} />
        <Route path={ROUTES.signIn} component={SignIn} />
        <Route path={ROUTES.privacy}>{() => <LegalPage doc="privacy" />}</Route>
        <Route path={ROUTES.terms}>{() => <LegalPage doc="terms" />}</Route>
        <Route path={ROUTES.cookies}>{() => <LegalPage doc="cookies" />}</Route>
        <Route path={ROUTES.disclaimer}>{() => <LegalPage doc="disclaimer" />}</Route>
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

function MarketingSite() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <ScrollManager />
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageTransition>
          <Router />
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  const [location] = useLocation();
  const isWorkspace = WORKSPACE_PREFIXES.some((p) => location === p || location.startsWith(`${p}/`));
  return (
    <HelmetProvider>
      {isWorkspace ? (
        <Suspense fallback={<div className="min-h-[100dvh] bg-mist" aria-busy="true" />}>
          <WorkspaceRoot />
        </Suspense>
      ) : (
        <MarketingSite />
      )}
    </HelmetProvider>
  );
}
