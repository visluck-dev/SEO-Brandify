/**
 * Mock data for the consultant console wireframes. The sample candidate
 * (Amelia) uses the full journey; the others are lightweight snapshots built
 * from short specs so the board, staleness queue and flows have something to
 * work on. All fictional.
 */
import type { ActivityEvent, Application, ApplicationStage, Consultant, Interview, Task, TaskKind, WorkspaceSnapshot } from "../data/types";
import { buildJourney, SCENARIOS } from "../data/mock/journey";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export const CONSULTANTS: Consultant[] = [
  { id: "cons-daniel", name: "Daniel Mercer", initials: "DM", title: "Career Consultant", replySla: "Replies within 1 business day", lastActiveAt: "", email: "daniel.mercer@example.com" },
  { id: "cons-grace", name: "Grace Adeyemi", initials: "GA", title: "Career Consultant", replySla: "Replies within 1 business day", lastActiveAt: "", email: "grace.adeyemi@example.com" },
];

interface AppSpec {
  company: string;
  role: string;
  location: string;
  daysAgo: number;
  stage: ApplicationStage;
  interviewInDays?: number;
}

interface LiteSpec {
  id: string;
  firstName: string;
  lastName: string;
  currentTitle: string;
  location: string;
  targetRoles: string[];
  locations: string[];
  consultantId: string;
  weeksIn: number;
  onboardingSteps: number;
  lastSeenHoursAgo: number;
  /** Hours since the last logged consultant/employer event — drives the staleness flag. */
  lastEventHoursAgo: number;
  sponsorship?: boolean;
  apps: AppSpec[];
  openTasks: { title: string; kind: TaskKind; dueInDays: number; owner: "candidate" | "consultant" }[];
}

const LITE: LiteSpec[] = [
  {
    id: "cand-priya", firstName: "Priya", lastName: "Nair", currentTitle: "Software Engineer, Brightwell Systems", location: "Manchester", targetRoles: ["Senior Software Engineer"], locations: ["Manchester", "Remote"],
    consultantId: "cons-daniel", weeksIn: 3, onboardingSteps: 5, lastSeenHoursAgo: 8 * 24, lastEventHoursAgo: 74,
    apps: [
      { company: "Ferncastle Software", role: "Senior Software Engineer", location: "Remote", daysAgo: 12, stage: "applied" },
      { company: "Northgate Health Tech", role: "Senior Engineer (Backend)", location: "Manchester", daysAgo: 10, stage: "shortlisted" },
      { company: "Ridgeway Payments", role: "Senior Software Engineer", location: "Leeds", daysAgo: 11, stage: "applied" },
      { company: "Ossian Labs", role: "Backend Engineer", location: "Remote", daysAgo: 6, stage: "applied" },
      { company: "Harbour & Co", role: "Senior Developer", location: "Manchester", daysAgo: 13, stage: "closed" },
    ],
    openTasks: [
      { title: "Approve CV v2", kind: "approve-cv", dueInDays: -2, owner: "candidate" },
      { title: "Follow up — Ferncastle Software", kind: "followup", dueInDays: 0, owner: "consultant" },
      { title: "Follow up — Ridgeway Payments", kind: "followup", dueInDays: 1, owner: "consultant" },
    ],
  },
  {
    id: "cand-tom", firstName: "Tom", lastName: "Okafor", currentTitle: "Marketing graduate, University of Leicester", location: "London", targetRoles: ["Marketing Executive", "Marketing Assistant"], locations: ["London"],
    consultantId: "cons-grace", weeksIn: 2, onboardingSteps: 5, lastSeenHoursAgo: 3, lastEventHoursAgo: 6,
    apps: [
      { company: "Larkspur Media", role: "Marketing Executive", location: "London", daysAgo: 3, stage: "applied" },
      { company: "Beacon Retail", role: "Marketing Assistant", location: "London", daysAgo: 1, stage: "applied" },
    ],
    openTasks: [{ title: "Review 3 opportunities", kind: "review-opportunities", dueInDays: 1, owner: "candidate" }],
  },
  {
    id: "cand-sofia", firstName: "Sofia", lastName: "Marques", currentTitle: "Finance Manager, Calder Group", location: "Birmingham", targetRoles: ["Head of FP&A", "Senior Finance Manager"], locations: ["Birmingham", "West Midlands"],
    consultantId: "cons-daniel", weeksIn: 7, onboardingSteps: 5, lastSeenHoursAgo: 20, lastEventHoursAgo: 26,
    apps: [
      { company: "Wrenfield Group", role: "Head of FP&A", location: "Birmingham", daysAgo: 30, stage: "interview", interviewInDays: 1 },
      { company: "Stanhope Logistics", role: "Senior Finance Manager", location: "Coventry", daysAgo: 27, stage: "interview", interviewInDays: 3 },
      { company: "Alder Foods", role: "Finance Business Partner", location: "Birmingham", daysAgo: 25, stage: "closed" },
      { company: "Corvid Energy", role: "Head of Finance", location: "Remote", daysAgo: 20, stage: "shortlisted" },
      { company: "Pennant Housing", role: "Senior Finance Manager", location: "Birmingham", daysAgo: 16, stage: "applied" },
      { company: "Maple & Reed", role: "FP&A Lead", location: "Solihull", daysAgo: 12, stage: "applied" },
    ],
    openTasks: [
      { title: "Prepare for Wrenfield — stage 2", kind: "prep", dueInDays: 0, owner: "candidate" },
      { title: "Confirm Thursday — Stanhope Logistics", kind: "confirm-interview", dueInDays: 0, owner: "candidate" },
      { title: "Chase decision — Corvid Energy", kind: "followup", dueInDays: 2, owner: "consultant" },
    ],
  },
  {
    id: "cand-arjun", firstName: "Arjun", lastName: "Mehta", currentTitle: "Data Analyst, Meridian Insights (Pune)", location: "Pune, India", targetRoles: ["Data Analyst", "Analytics Engineer"], locations: ["London", "Remote (UK)"],
    consultantId: "cons-grace", weeksIn: 1, onboardingSteps: 3, lastSeenHoursAgo: 30, lastEventHoursAgo: 52, sponsorship: true,
    apps: [],
    openTasks: [
      { title: "Upload your current CV", kind: "custom", dueInDays: -1, owner: "candidate" },
      { title: "Confirm target roles and preferences", kind: "custom", dueInDays: 0, owner: "candidate" },
      { title: "Profile assessment", kind: "custom", dueInDays: 1, owner: "consultant" },
    ],
  },
  {
    id: "cand-hannah", firstName: "Hannah", lastName: "Lewis", currentTitle: "Project Manager, Tyne Digital", location: "Leeds", targetRoles: ["Programme Manager", "Senior Project Manager"], locations: ["Leeds", "Hybrid"],
    consultantId: "cons-grace", weeksIn: 4, onboardingSteps: 5, lastSeenHoursAgo: 5, lastEventHoursAgo: 4,
    apps: [
      { company: "Kingsmoor Council", role: "Programme Manager", location: "Leeds", daysAgo: 18, stage: "shortlisted" },
      { company: "Ashby Rail", role: "Senior Project Manager", location: "York", daysAgo: 15, stage: "applied" },
      { company: "Loxley Bank", role: "Programme Manager, Change", location: "Leeds", daysAgo: 11, stage: "applied" },
      { company: "Fenwick & Hale", role: "Senior Project Manager", location: "Leeds", daysAgo: 8, stage: "applied" },
      { company: "Bramble & Co", role: "PMO Lead", location: "Sheffield", daysAgo: 5, stage: "applied" },
      { company: "Orbital Energy", role: "Programme Manager", location: "Remote", daysAgo: 2, stage: "applied" },
    ],
    openTasks: [
      { title: "Review 2 opportunities", kind: "review-opportunities", dueInDays: 1, owner: "candidate" },
      { title: "Follow up — Ashby Rail", kind: "followup", dueInDays: 0, owner: "consultant" },
    ],
  },
];

/** Builds a plausible snapshot from a short spec, dated relative to `now`. */
function buildLite(spec: LiteSpec, nowMs: number): WorkspaceSnapshot {
  const iso = (ms: number) => new Date(ms).toISOString();
  const kickoffMs = nowMs - spec.weeksIn * 7 * DAY;
  const events: ActivityEvent[] = [];
  const tasks: Task[] = [];
  const interviews: Interview[] = [];
  let seq = 0;
  const ev = (at: number, e: Omit<ActivityEvent, "id" | "at">) => events.push({ id: `${spec.id}-ev-${++seq}`, at: iso(at), ...e });

  ev(kickoffMs + 9 * HOUR, { type: "kickoff.completed", actor: "consultant", title: "Kick-off call completed", detail: `Targets: ${spec.targetRoles.join(" / ")}, ${spec.locations.join(" / ")}.` });
  if (spec.onboardingSteps >= 5) ev(kickoffMs + 10 * HOUR, { type: "candidate.onboarded", actor: "candidate", title: "Workspace set up" });

  const applications: Application[] = spec.apps.map((a, i) => {
    const id = `${spec.id}-app-${i + 1}`;
    const sentMs = nowMs - a.daysAgo * DAY;
    const history: Application["history"] = [{ stage: "applied", at: iso(sentMs) }];
    ev(sentMs, { type: "application.sent", actor: "consultant", title: `Applied — ${a.company}, ${a.role}`, applicationId: id });
    if (a.daysAgo >= 7 && a.stage === "applied") {
      ev(sentMs + 7 * DAY, { type: "followup.sent", actor: "consultant", title: `Follow-up sent — ${a.company}`, applicationId: id });
    }
    if (a.stage === "shortlisted" || a.stage === "interview") {
      const at = sentMs + Math.min(5, a.daysAgo - 1) * DAY;
      ev(at, { type: "employer.replied", actor: "employer", title: `${a.company} replied`, detail: "Would like to progress.", applicationId: id });
      ev(at + 5 * 60_000, { type: "stage.changed", actor: "consultant", title: `${a.company} → Shortlisted`, applicationId: id });
      history.push({ stage: "shortlisted", at: iso(at + 5 * 60_000) });
    }
    if (a.stage === "interview") {
      const bookedAt = nowMs - 2 * DAY;
      const intId = `${spec.id}-int-${i + 1}`;
      history.push({ stage: "interview", at: iso(bookedAt), note: "Interview booked." });
      ev(bookedAt, { type: "interview.scheduled", actor: "consultant", title: `Interview booked — ${a.company}`, applicationId: id, interviewId: intId });
      interviews.push({
        id: intId, applicationId: id, stageLabel: "Stage 1", at: iso(nowMs + (a.interviewInDays ?? 2) * DAY), durationMinutes: 45, format: "Video", where: "Video link in the invite",
        interviewers: ["Hiring manager"], scheduledAt: iso(bookedAt), confirmedAt: iso(bookedAt + 3 * HOUR),
        prep: { companyBrief: ["Brief to follow."], roleBrief: ["Brief to follow."], likelyQuestions: [], starPrompts: [], checklist: [] }, starAnswers: {},
      });
    }
    if (a.stage === "closed") {
      const at = sentMs + Math.min(7, Math.max(1, a.daysAgo - 1)) * DAY;
      history.push({ stage: "closed", at: iso(at), reason: "unsuccessful", note: "Employer went with another candidate." });
      ev(at, { type: "stage.changed", actor: "consultant", title: `${a.company} → Closed (unsuccessful)`, applicationId: id });
    }
    return { id, company: a.company, role: a.role, location: a.location, workMode: "Hybrid", source: "Company site", sentAt: iso(sentMs), cvVersionId: `${spec.id}-cv-v2`, history, notes: [] };
  });

  // Pin the most recent consultant-side event to the spec's staleness value.
  ev(nowMs - spec.lastEventHoursAgo * HOUR, { type: "note.added", actor: "consultant", title: "Progress note", detail: "Weekly check on the target list." });

  spec.openTasks.forEach((t, i) => {
    tasks.push({ id: `${spec.id}-task-${i + 1}`, title: t.title, owner: t.owner, kind: t.kind, createdAt: iso(nowMs - 3 * DAY), dueAt: iso(nowMs + t.dueInDays * DAY + 8 * HOUR) });
  });

  const steps = (["details", "documents", "targets", "availability", "notifications"] as const).slice(0, spec.onboardingSteps);
  return {
    candidate: {
      id: spec.id, firstName: spec.firstName, lastName: spec.lastName, email: `${spec.firstName.toLowerCase()}.${spec.lastName.toLowerCase()}@example.com`, location: spec.location,
      currentTitle: spec.currentTitle, yearsExperience: "5–9 years", consultantId: spec.consultantId, status: "active", searchStartedAt: iso(kickoffMs).slice(0, 10),
      lastSeenAt: iso(nowMs - spec.lastSeenHoursAgo * HOUR), onboarding: { completedSteps: [...steps] },
      preferences: { targetRoles: spec.targetRoles, locations: spec.locations, workModes: ["Hybrid", "Remote"], sponsorshipRequired: !!spec.sponsorship, noticePeriod: "4 weeks", approvalMode: "approve-first" },
    },
    consultant: CONSULTANTS.find((c) => c.id === spec.consultantId)!,
    searchPlan: [],
    applications,
    events,
    tasks,
    interviews,
    documents: [{ id: `${spec.id}-cv`, kind: "cv", title: "CV", versions: [{ id: `${spec.id}-cv-v2`, version: 2, createdAt: iso(kickoffMs + 3 * DAY), changeNote: "UK format rebuild.", status: "approved", approvedAt: iso(kickoffMs + 4 * DAY), fileName: "CV-v2.pdf" }] }],
    opportunities: [],
    messages: [],
    reports: [],
    notifications: { instant: true, dailyDigest: true, weeklyReport: true, channels: { email: true, whatsapp: false } },
  };
}

/** The console's clock is the sample search's clock (week 5), so Amelia's data lines up with the demo. */
export function buildOpsCandidates(): { now: string; snapshots: WorkspaceSnapshot[] } {
  const scenario = SCENARIOS.find((s) => s.id === "week5")!;
  const { snapshot, viewedAt } = buildJourney(scenario);
  const nowMs = new Date(viewedAt).getTime();
  CONSULTANTS.forEach((c) => (c.lastActiveAt = new Date(nowMs - 25 * 60_000).toISOString()));
  return { now: viewedAt, snapshots: [snapshot, ...LITE.map((spec) => buildLite(spec, nowMs))] };
}
