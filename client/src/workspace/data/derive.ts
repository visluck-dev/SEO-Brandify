/**
 * Turns a raw WorkspaceSnapshot into what the screens render, as of `now`.
 *
 * Everything time-based (stages, KPIs, "since your last visit", the plan week)
 * is computed here so the demo, the prototype and the real API share one set
 * of rules. Records dated after `now` are treated as not having happened yet.
 */
import type {
  ActivityEvent,
  Application,
  ApplicationStage,
  Candidate,
  CandidateDocument,
  ClosedReason,
  Consultant,
  DocumentVersion,
  Interview,
  Message,
  NotificationSettings,
  Opportunity,
  SearchPlanWeek,
  Task,
  TaskOwner,
  WeeklyReport,
  WorkspaceSnapshot,
} from "./types";
import { daysBetween, fmtWeekday } from "./format";

export type StatusTone = "neutral" | "progressing" | "scheduled" | "waiting" | "closed";

export interface NextAction {
  taskId: string;
  title: string;
  dueAt: string;
  owner: TaskOwner;
}

export interface ApplicationView extends Application {
  stage: ApplicationStage;
  stageAt: string;
  stageNote?: string;
  closedReason?: ClosedReason;
  statusLabel: string;
  tone: StatusTone;
  nextAction?: NextAction;
  nextInterview?: InterviewView;
  lastActivityAt: string;
  events: ActivityEvent[];
  cvVersion?: DocumentVersion;
}

export interface InterviewView extends Interview {
  company: string;
  role: string;
  isPast: boolean;
}

export interface Kpi {
  key: "applications" | "shortlisted" | "interviews" | "pending" | "followups";
  label: string;
  value: number;
  delta: string;
}

export interface PlanWeekView extends SearchPlanWeek {
  status: "done" | "current" | "upcoming";
}

export interface SinceLastVisit {
  since: string;
  total: number;
  summary: { label: string; count: number }[];
  events: ActivityEvent[];
}

export interface WorkspaceState {
  now: string;
  candidate: Candidate;
  consultant: Consultant;
  kpis: Kpi[];
  pipeline: { stage: string; count: number }[];
  applications: ApplicationView[];
  events: ActivityEvent[];
  tasks: { open: Task[]; done: Task[]; consultantOpen: Task[] };
  interviews: { upcoming: InterviewView[]; past: InterviewView[]; all: InterviewView[] };
  documents: CandidateDocument[];
  opportunities: { pending: Opportunity[]; decided: Opportunity[] };
  messages: Message[];
  reports: WeeklyReport[];
  plan: PlanWeekView[];
  currentWeek: number;
  sinceLastVisit: SinceLastVisit;
  milestones: ActivityEvent[];
  notifications: NotificationSettings;
}

const byTimeAsc = <T extends { at: string }>(a: T, b: T) => a.at.localeCompare(b.at);
const before = (iso: string | undefined, now: string) => !!iso && iso <= now;

const CLOSED_LABEL: Record<ClosedReason, string> = {
  "no-response": "Closed · no response",
  unsuccessful: "Closed · unsuccessful",
  withdrawn: "Withdrawn",
  "role-paused": "Closed · role paused",
  "offer-declined": "Offer declined",
};

export function stageLabel(stage: ApplicationStage, reason?: ClosedReason): string {
  switch (stage) {
    case "applied": return "Applied";
    case "shortlisted": return "Shortlisted";
    case "interview": return "Interview";
    case "offer": return "Offer";
    case "closed": return reason ? CLOSED_LABEL[reason] : "Closed";
  }
}

export function deriveState(snapshot: WorkspaceSnapshot, now: string): WorkspaceState {
  const events = snapshot.events.filter((e) => e.at <= now).sort(byTimeAsc).reverse();

  const tasksAll = snapshot.tasks
    .filter((t) => t.createdAt <= now)
    .map((t) => (before(t.completedAt, now) ? t : { ...t, completedAt: undefined }));
  const openTasks = tasksAll.filter((t) => !t.completedAt).sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  const documents: CandidateDocument[] = snapshot.documents
    .map((d) => {
      const versions = d.versions.filter((v) => v.createdAt <= now).sort((a, b) => a.version - b.version);
      return {
        ...d,
        versions: versions.map((v, i) => {
          const approvedAt = before(v.approvedAt, now) ? v.approvedAt : undefined;
          // A version is superseded only once a later version has been approved.
          const laterApproved = versions.slice(i + 1).some((later) => later.status !== "draft" && later.status !== "awaiting-approval" && before(later.approvedAt ?? later.createdAt, now));
          let status: DocumentVersion["status"] = v.status === "superseded" ? "approved" : v.status;
          if (status === "approved" && !approvedAt) status = "awaiting-approval";
          if (laterApproved) status = "superseded";
          return { ...v, status, approvedAt };
        }),
      };
    })
    .filter((d) => d.versions.length > 0);
  const versionById = new Map(documents.flatMap((d) => d.versions.map((v) => [v.id, v] as const)));

  const applicationsRaw = snapshot.applications.filter((a) => a.sentAt <= now);
  const appById = new Map(applicationsRaw.map((a) => [a.id, a]));

  const interviewsAll: InterviewView[] = snapshot.interviews
    .filter((i) => i.scheduledAt <= now && appById.has(i.applicationId))
    .map((i) => {
      const app = appById.get(i.applicationId)!;
      return {
        ...i,
        confirmedAt: before(i.confirmedAt, now) ? i.confirmedAt : undefined,
        debrief: i.debrief && i.debrief.submittedAt <= now ? i.debrief : undefined,
        feedback: i.feedback && i.feedback.at <= now ? i.feedback : undefined,
        company: app.company,
        role: app.role,
        isPast: i.at <= now,
      };
    })
    .sort(byTimeAsc);

  const applications: ApplicationView[] = applicationsRaw
    .map((a) => {
      const history = a.history.filter((h) => h.at <= now);
      const current = history[history.length - 1] ?? { stage: "applied" as const, at: a.sentAt };
      const appEvents = events.filter((e) => e.applicationId === a.id).slice().reverse();
      const next = openTasks.find((t) => t.applicationId === a.id);
      const nextInterview = interviewsAll.find((i) => i.applicationId === a.id && !i.isPast);
      const lastInterview = interviewsAll.filter((i) => i.applicationId === a.id).pop();
      const ageDays = -daysBetween(now, a.sentAt);

      let statusLabel = stageLabel(current.stage, current.reason);
      let tone: StatusTone = "neutral";
      if (current.stage === "applied" && ageDays >= 7) {
        statusLabel = "Pending";
        tone = "waiting";
      } else if (current.stage === "shortlisted" || current.stage === "offer") tone = "progressing";
      else if (current.stage === "interview") {
        tone = "scheduled";
        statusLabel = nextInterview ? "Interview booked" : lastInterview?.feedback ? "Interview · feedback in" : "Interviewed";
      } else if (current.stage === "closed") tone = "closed";

      return {
        ...a,
        history,
        notes: a.notes.filter((n) => n.at <= now),
        stage: current.stage,
        stageAt: current.at,
        stageNote: current.note,
        closedReason: current.reason,
        statusLabel,
        tone,
        nextAction: next ? { taskId: next.id, title: next.title, dueAt: next.dueAt, owner: next.owner } : undefined,
        nextInterview,
        lastActivityAt: appEvents[appEvents.length - 1]?.at ?? a.sentAt,
        events: appEvents,
        cvVersion: versionById.get(a.cvVersionId),
      };
    })
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));

  /* KPIs and pipeline (funnel semantics: "reached this stage") */
  const reached = (a: ApplicationView, stages: ApplicationStage[]) => a.history.some((h) => stages.includes(h.stage));
  const weekAgo = new Date(new Date(now).getTime() - 7 * 86_400_000).toISOString();
  const sentThisWeek = applications.filter((a) => a.sentAt >= weekAgo).length;
  const shortlisted = applications.filter((a) => a.stage !== "closed" && reached(a, ["shortlisted", "interview", "offer"]));
  const shortlistedThisWeek = shortlisted.filter((a) => (a.history.find((h) => h.stage === "shortlisted")?.at ?? "") >= weekAgo).length;
  const upcoming = interviewsAll.filter((i) => !i.isPast);
  const pending = applications.filter((a) => a.stage === "applied");
  const consultantOpen = openTasks.filter((t) => t.owner === "consultant");
  const followups = consultantOpen.filter((t) => t.kind === "followup");
  const nextFollowup = followups[0];

  const kpis: Kpi[] = [
    { key: "applications", label: "Applications", value: applications.length, delta: sentThisWeek ? `+${sentThisWeek} this week` : applications.length ? "none this week" : "first ones next week" },
    { key: "shortlisted", label: "Shortlisted", value: shortlisted.length, delta: shortlistedThisWeek ? `+${shortlistedThisWeek} this week` : shortlisted.length ? "holding steady" : "awaiting first reply" },
    { key: "interviews", label: "Interviews", value: interviewsAll.length, delta: upcoming.length ? `${upcoming.length} upcoming` : interviewsAll.length ? "all completed" : "none yet" },
    { key: "pending", label: "Pending", value: pending.length, delta: pending.length ? "awaiting reply" : "nothing waiting" },
    { key: "followups", label: "Follow-ups", value: followups.length, delta: nextFollowup ? `next ${fmtWeekday(nextFollowup.dueAt)}` : "none due" },
  ];

  const pipeline = [
    { stage: "Applied", count: applications.length },
    { stage: "Shortlisted", count: applications.filter((a) => reached(a, ["shortlisted", "interview", "offer"])).length },
    { stage: "Interview", count: applications.filter((a) => reached(a, ["interview", "offer"])).length },
    { stage: "Offer", count: applications.filter((a) => reached(a, ["offer"])).length },
  ];

  /* Opportunities, messages, reports */
  const opportunitiesAll = snapshot.opportunities
    .filter((o) => o.addedAt <= now)
    .map((o) => ({
      ...o,
      decision: o.decision && o.decision.at <= now ? o.decision : undefined,
      applicationId: o.applicationId && appById.has(o.applicationId) ? o.applicationId : undefined,
    }));
  const opportunities = {
    pending: opportunitiesAll.filter((o) => !o.decision).sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
    decided: opportunitiesAll.filter((o) => o.decision).sort((a, b) => b.decision!.at.localeCompare(a.decision!.at)),
  };
  const messages = snapshot.messages.filter((m) => m.at <= now).sort(byTimeAsc);
  const reports = snapshot.reports.filter((r) => r.publishedAt <= now).sort((a, b) => b.week - a.week);

  /* Plan */
  const daysIn = Math.max(0, daysBetween(snapshot.candidate.searchStartedAt, now));
  const currentWeek = Math.floor(daysIn / 7) + 1;
  const plan: PlanWeekView[] = snapshot.searchPlan.map((w) => ({
    ...w,
    status: w.week < currentWeek ? "done" : w.week === currentWeek ? "current" : "upcoming",
  }));

  /* Candidate status */
  const placement = snapshot.candidate.placement && snapshot.candidate.placement.acceptedAt <= now ? snapshot.candidate.placement : undefined;
  const onboardingDone = snapshot.candidate.onboarding.completedSteps.length >= 5;
  const candidate: Candidate = {
    ...snapshot.candidate,
    status: placement ? "placed" : onboardingDone ? "active" : "onboarding",
    placement,
  };

  /* Since your last visit — counted from domain objects, not just events, so "2 opportunities" is accurate. */
  const since = candidate.lastSeenAt;
  const fresh = <T>(items: T[], at: (t: T) => string) => items.filter((t) => at(t) > since && at(t) <= now).length;
  const evCount = (types: ActivityEvent["type"][]) => events.filter((e) => e.at > since && types.includes(e.type) && e.actor !== "candidate").length;
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
  const counts: [number, string, string][] = [
    [fresh(applications, (a) => a.sentAt), "application sent", "applications sent"],
    [evCount(["employer.replied", "interview.feedback", "offer.received"]), "employer reply", "employer replies"],
    [evCount(["interview.scheduled"]), "interview booked", "interviews booked"],
    [evCount(["interview.completed"]), "interview completed", "interviews completed"],
    [evCount(["followup.sent"]), "follow-up sent", "follow-ups sent"],
    [fresh(opportunities.pending, (o) => o.addedAt), "opportunity to review", "opportunities to review"],
    [fresh(documents.flatMap((d) => d.versions), (v) => v.createdAt), "document updated", "documents updated"],
    [evCount(["note.added"]) + fresh(messages.filter((m) => m.from === "consultant"), (m) => m.at), "note from your consultant", "notes from your consultant"],
  ];
  const summaryAll = counts.filter(([n]) => n > 0).map(([count, one, many]) => ({ label: plural(count, one, many), count }));
  const freshEvents = events.filter((e) => e.at > since && e.actor !== "candidate");
  const sinceLastVisit: SinceLastVisit = { since, total: freshEvents.length, summary: summaryAll.slice(0, 4), events: freshEvents };

  return {
    now,
    candidate,
    consultant: snapshot.consultant,
    kpis,
    pipeline,
    applications,
    events,
    tasks: { open: openTasks.filter((t) => t.owner === "candidate"), done: tasksAll.filter((t) => t.owner === "candidate" && t.completedAt).sort((a, b) => b.completedAt!.localeCompare(a.completedAt!)), consultantOpen },
    interviews: { upcoming, past: interviewsAll.filter((i) => i.isPast).reverse(), all: interviewsAll },
    documents,
    opportunities,
    messages,
    reports,
    plan,
    currentWeek,
    sinceLastVisit,
    milestones: events.filter((e) => e.type === "milestone"),
    notifications: snapshot.notifications,
  };
}
