import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Router, Switch, useLocation } from "wouter";

import { SEO } from "@/components/SEO";
import { WorkspaceProvider } from "./data/WorkspaceContext";
import { MockDataProvider } from "./data/mock/MockDataProvider";
import { SCENARIOS, type ScenarioId } from "./data/mock/journey";
import { DEMO_BASE, OPS_BASE, WS } from "./routes";
import { DemoBar } from "./shell/DemoBar";
import { WorkspaceShell } from "./shell/WorkspaceShell";
import TodayPage from "./pages/TodayPage";

const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage"));
const ApplicationDetailPage = lazy(() => import("./pages/ApplicationDetailPage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const ActionsPage = lazy(() => import("./pages/ActionsPage"));
const InterviewsPage = lazy(() => import("./pages/InterviewsPage"));
const InterviewDetailPage = lazy(() => import("./pages/InterviewDetailPage"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ReportDetailPage = lazy(() => import("./pages/ReportsPage").then((m) => ({ default: m.ReportDetailPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PlanPage = lazy(() => import("./pages/PlanPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const OpsRoot = lazy(() => import("./ops/OpsRoot"));

const SCENARIO_KEY = "visluck-demo-scenario";

function readScenario(): ScenarioId {
  try {
    const v = sessionStorage.getItem(SCENARIO_KEY);
    if (v && SCENARIOS.some((s) => s.id === v)) return v as ScenarioId;
  } catch {
    /* private mode */
  }
  return "week5";
}

function Loading() {
  return <div className="min-h-[100dvh] bg-mist" aria-busy="true" />;
}

/** Candidate screens inside the shell. Paths are relative to the router base. */
function CandidateRoutes() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
      <Switch>
        <Route path={WS.today} component={TodayPage} />
        <Route path={WS.applications} component={ApplicationsPage} />
        <Route path="/applications/:id">{(p) => <ApplicationDetailPage id={p.id} />}</Route>
        <Route path={WS.activity} component={ActivityPage} />
        <Route path={WS.actions} component={ActionsPage} />
        <Route path={WS.interviews} component={InterviewsPage} />
        <Route path="/interviews/:id">{(p) => <InterviewDetailPage id={p.id} />}</Route>
        <Route path={WS.opportunities} component={OpportunitiesPage} />
        <Route path={WS.documents} component={DocumentsPage} />
        <Route path={WS.messages} component={MessagesPage} />
        <Route path={WS.reports} component={ReportsPage} />
        <Route path="/reports/:id">{(p) => <ReportDetailPage id={p.id} />}</Route>
        <Route path={WS.profile} component={ProfilePage} />
        <Route path={WS.settings} component={SettingsPage} />
        <Route path={WS.plan} component={PlanPage} />
        <Route component={TodayPage} />
      </Switch>
    </Suspense>
  );
}

/** /demo — the sample workspace on the mock provider, with the scenario strip. */
function DemoWorkspace() {
  const [scenario, setScenario] = useState<ScenarioId>(readScenario);
  const data = useMemo(() => new MockDataProvider(scenario), [scenario]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SCENARIO_KEY, scenario);
    } catch {
      /* ignore */
    }
  }, [scenario]);

  return (
    <Router base={DEMO_BASE}>
      <SEO title="Try the candidate workspace | VisLuck" description="A sample VisLuck candidate workspace: applications, interviews, actions and weekly reports on fictional data." noindex />
      <WorkspaceProvider data={data} mode="demo" fallback={<Loading />}>
        <Switch>
          <Route path={WS.start}>
            <Suspense fallback={<Loading />}>
              <OnboardingPage />
            </Suspense>
          </Route>
          <Route>
            <WorkspaceShell banner={<DemoBar scenario={scenario} onChange={setScenario} />}>
              <CandidateRoutes />
            </WorkspaceShell>
          </Route>
        </Switch>
      </WorkspaceProvider>
    </Router>
  );
}

/** Entry for every non-marketing route (/demo/*, /ops/*). Scrolls to top on navigation like the marketing site. */
export default function WorkspaceRoot() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  if (location.startsWith(OPS_BASE)) {
    return (
      <Suspense fallback={<Loading />}>
        <OpsRoot />
      </Suspense>
    );
  }
  return <DemoWorkspace />;
}
