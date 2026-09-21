/**
 * In-memory store behind the consultant console wireframes. Every action here
 * appends the same events the backend will, so the candidate's workspace view
 * of the same snapshot (deriveState) changes the moment a consultant logs
 * something — the whole point of the 10-second quick-log.
 */
import { deriveState, type WorkspaceState } from "../data/derive";
import type { ActivityEvent, ApplicationSource, ApplicationStage, ClosedReason, InterviewFormat, TaskKind, WeeklyReport, WorkspaceSnapshot } from "../data/types";
import { buildOpsCandidates, CONSULTANTS } from "./opsData";

const HOUR = 3_600_000;
export const STALE_AFTER_HOURS = 48;
export const AT_RISK_AFTER_DAYS = 7;

export interface OpsRow {
  id: string;
  name: string;
  consultant: string;
  week: number;
  status: string;
  onboardingDone: boolean;
  applications: number;
  candidateOpen: number;
  lastEventAt: string;
  hoursSinceEvent: number;
  stale: boolean;
  daysSinceSeen: number;
  atRisk: boolean;
  interviewsThisWeek: number;
  followupsDueToday: number;
}

export class OpsStore {
  readonly now: string;
  private snapshots = new Map<string, WorkspaceSnapshot>();
  private listeners = new Set<() => void>();
  private seq = 5000;
  private clock: number;

  constructor() {
    const { now, snapshots } = buildOpsCandidates();
    this.now = now;
    this.clock = new Date(now).getTime();
    snapshots.forEach((s) => this.snapshots.set(s.candidate.id, s));
  }

  subscribe(l: () => void): () => void {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }
  private emit() {
    this.listeners.forEach((l) => l());
  }
  private tick() {
    this.clock += 60_000;
    return new Date(this.clock).toISOString();
  }
  private id(prefix: string) {
    return `${prefix}-${++this.seq}`;
  }

  snapshot(id: string) {
    return this.snapshots.get(id);
  }
  state(id: string): WorkspaceState | undefined {
    const s = this.snapshots.get(id);
    return s ? deriveState(s, new Date(this.clock).toISOString()) : undefined;
  }
  consultantName(id: string) {
    return CONSULTANTS.find((c) => c.id === id)?.name ?? "—";
  }

  rows(): OpsRow[] {
    const nowMs = this.clock;
    const weekEnd = nowMs + 7 * 24 * HOUR;
    return Array.from(this.snapshots.values())
      .map((s) => {
        const st = deriveState(s, new Date(nowMs).toISOString());
        const lastEvent = st.events.find((e) => e.actor !== "candidate");
        const lastEventAt = lastEvent?.at ?? s.candidate.searchStartedAt;
        const hoursSinceEvent = (nowMs - new Date(lastEventAt).getTime()) / HOUR;
        const daysSinceSeen = (nowMs - new Date(s.candidate.lastSeenAt).getTime()) / (24 * HOUR);
        const todayKey = new Date(nowMs).toISOString().slice(0, 10);
        return {
          id: s.candidate.id,
          name: `${s.candidate.firstName} ${s.candidate.lastName}`,
          consultant: this.consultantName(s.candidate.consultantId),
          week: st.currentWeek,
          status: st.candidate.status,
          onboardingDone: s.candidate.onboarding.completedSteps.length >= 5,
          applications: st.applications.length,
          candidateOpen: st.tasks.open.length,
          lastEventAt,
          hoursSinceEvent,
          stale: hoursSinceEvent > STALE_AFTER_HOURS,
          daysSinceSeen,
          atRisk: daysSinceSeen > AT_RISK_AFTER_DAYS,
          interviewsThisWeek: st.interviews.upcoming.filter((i) => new Date(i.at).getTime() <= weekEnd).length,
          followupsDueToday: st.tasks.consultantOpen.filter((t) => t.dueAt.slice(0, 10) <= todayKey).length,
        };
      })
      .sort((a, b) => Number(b.stale) - Number(a.stale) || b.hoursSinceEvent - a.hoursSinceEvent);
  }

  private log(s: WorkspaceSnapshot, e: Omit<ActivityEvent, "id" | "at">, at: string) {
    s.events.push({ id: this.id("ev"), at, ...e });
  }

  /* ------------------------------------------------------------ the flows */

  logApplication(candidateId: string, input: { company: string; role: string; location: string; jobUrl?: string; source: ApplicationSource; stage: ApplicationStage; note?: string }) {
    const s = this.snapshots.get(candidateId);
    if (!s) return;
    const at = this.tick();
    const id = this.id("app");
    const cv = s.documents.find((d) => d.kind === "cv")?.versions.slice(-1)[0];
    s.applications.push({
      id, company: input.company, role: input.role, location: input.location, workMode: "Hybrid", source: input.source, jobUrl: input.jobUrl,
      sentAt: at, cvVersionId: cv?.id ?? "", history: [{ stage: "applied", at }, ...(input.stage !== "applied" ? [{ stage: input.stage, at }] : [])], notes: input.note ? [{ at, by: "consultant" as const, body: input.note }] : [],
    });
    this.log(s, { type: "application.sent", actor: "consultant", title: `Applied — ${input.company}, ${input.role}`, detail: input.note, applicationId: id }, at);
    // A follow-up is scheduled automatically a week out — nothing is sent and forgotten.
    s.tasks.push({ id: this.id("task"), title: `Follow up — ${input.company}`, owner: "consultant", kind: "followup", createdAt: at, dueAt: new Date(new Date(at).getTime() + 7 * 24 * HOUR).toISOString(), applicationId: id });
    this.emit();
    return id;
  }

  updateStage(candidateId: string, applicationId: string, stage: ApplicationStage, note?: string, reason?: ClosedReason) {
    const s = this.snapshots.get(candidateId);
    const a = s?.applications.find((x) => x.id === applicationId);
    if (!s || !a) return;
    const at = this.tick();
    a.history.push({ stage, at, note, reason });
    const label = stage === "closed" ? `Closed${reason ? ` (${reason.replace("-", " ")})` : ""}` : stage.charAt(0).toUpperCase() + stage.slice(1);
    this.log(s, { type: "stage.changed", actor: "consultant", title: `${a.company} → ${label}`, detail: note, applicationId }, at);
    this.emit();
  }

  logFollowup(candidateId: string, applicationId: string, note?: string) {
    const s = this.snapshots.get(candidateId);
    const a = s?.applications.find((x) => x.id === applicationId);
    if (!s || !a) return;
    const at = this.tick();
    this.log(s, { type: "followup.sent", actor: "consultant", title: `Follow-up sent — ${a.company}`, detail: note, applicationId }, at);
    const open = s.tasks.find((t) => t.applicationId === applicationId && t.kind === "followup" && !t.completedAt);
    if (open) open.completedAt = at;
    const nth = s.events.filter((e) => e.type === "followup.sent" && e.applicationId === applicationId).length + 1;
    s.tasks.push({ id: this.id("task"), title: `Follow-up ${nth} — ${a.company}`, owner: "consultant", kind: "followup", createdAt: at, dueAt: new Date(new Date(at).getTime() + 7 * 24 * HOUR).toISOString(), applicationId });
    this.emit();
  }

  logReply(candidateId: string, applicationId: string, note: string) {
    const s = this.snapshots.get(candidateId);
    const a = s?.applications.find((x) => x.id === applicationId);
    if (!s || !a) return;
    const at = this.tick();
    this.log(s, { type: "employer.replied", actor: "employer", title: `${a.company} replied`, detail: note, applicationId }, at);
    this.emit();
  }

  scheduleInterview(candidateId: string, applicationId: string, input: { at: string; durationMinutes: number; format: InterviewFormat; where: string; stageLabel: string; interviewers: string }) {
    const s = this.snapshots.get(candidateId);
    const a = s?.applications.find((x) => x.id === applicationId);
    if (!s || !a) return;
    const at = this.tick();
    const id = this.id("int");
    s.interviews.push({
      id, applicationId, stageLabel: input.stageLabel, at: input.at, durationMinutes: input.durationMinutes, format: input.format, where: input.where,
      interviewers: input.interviewers.split(",").map((x) => x.trim()).filter(Boolean), scheduledAt: at,
      prep: { companyBrief: ["Brief to follow within 24 hours."], roleBrief: ["Brief to follow within 24 hours."], likelyQuestions: [], starPrompts: ["A time you turned a vague request into clear requirements.", "A stakeholder who disagreed with you.", "A delivery that slipped."], checklist: ["Test the link 10 minutes early", "Two questions ready for the panel"] },
      starAnswers: {},
    });
    if (a.history[a.history.length - 1]?.stage !== "interview") a.history.push({ stage: "interview", at, note: `${input.stageLabel} booked.` });
    this.log(s, { type: "interview.scheduled", actor: "consultant", title: `Interview booked — ${a.company}, ${input.stageLabel}`, detail: `${input.format}, ${input.where}`, applicationId, interviewId: id }, at);
    // The candidate gets two tasks: confirm the slot, then prepare.
    const confirmId = this.id("task");
    s.tasks.push({ id: confirmId, title: `Confirm interview — ${a.company}`, owner: "candidate", kind: "confirm-interview", createdAt: at, dueAt: new Date(new Date(at).getTime() + 24 * HOUR).toISOString(), applicationId, interviewId: id });
    s.tasks.push({ id: this.id("task"), title: `Prepare for ${a.company} — ${input.stageLabel}`, owner: "candidate", kind: "prep", createdAt: at, dueAt: new Date(new Date(input.at).getTime() - 18 * HOUR).toISOString(), applicationId, interviewId: id, detail: "Open the prep kit: company brief, likely questions and your STAR bank." });
    this.emit();
  }

  assignTask(candidateId: string, input: { title: string; detail?: string; kind: TaskKind; dueAt: string; applicationId?: string }) {
    const s = this.snapshots.get(candidateId);
    if (!s) return;
    const at = this.tick();
    const id = this.id("task");
    s.tasks.push({ id, title: input.title, detail: input.detail, owner: "candidate", kind: input.kind, createdAt: at, dueAt: input.dueAt, applicationId: input.applicationId });
    this.log(s, { type: "task.assigned", actor: "consultant", title: `Task for ${s.candidate.firstName}: ${input.title}`, detail: input.detail, taskId: id, applicationId: input.applicationId }, at);
    this.emit();
  }

  /** Auto-draft from the last seven days of events; the consultant edits before publishing. */
  draftReport(candidateId: string): Omit<WeeklyReport, "id" | "publishedAt"> | undefined {
    const st = this.state(candidateId);
    if (!st) return;
    const weekAgo = new Date(this.clock - 7 * 24 * HOUR).toISOString();
    const recent = st.events.filter((e) => e.at >= weekAgo);
    // Label the report by the Monday on or before the start of the window.
    const start = new Date(weekAgo);
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
    const weekStartsOn = start.toISOString().slice(0, 10);
    const pick = (types: ActivityEvent["type"][]) => recent.filter((e) => types.includes(e.type)).map((e) => e.title).reverse();
    const did = pick(["application.sent", "followup.sent", "document.versioned", "note.added", "opportunity.added"]);
    const happened = pick(["employer.replied", "stage.changed", "interview.scheduled", "interview.completed", "interview.feedback", "offer.received", "application.viewed"]);
    const next = [...st.tasks.consultantOpen.slice(0, 3).map((t) => t.title), ...st.interviews.upcoming.slice(0, 2).map((i) => `Interview — ${i.company}, ${i.stageLabel}`), ...st.tasks.open.slice(0, 2).map((t) => `You: ${t.title}`)];
    return {
      week: st.currentWeek,
      weekStartsOn,
      did: did.length ? did : ["Target list reviewed against your preferences"],
      happened: happened.length ? happened : ["No employer movement this week — follow-ups continue"],
      next: next.length ? next : ["Applications continue against the target list"],
      numbers: {
        applications: recent.filter((e) => e.type === "application.sent").length,
        replies: recent.filter((e) => e.type === "employer.replied" || e.type === "interview.feedback").length,
        interviews: recent.filter((e) => e.type === "interview.scheduled" || e.type === "interview.completed").length,
        followups: recent.filter((e) => e.type === "followup.sent").length,
      },
    };
  }

  publishReport(candidateId: string, report: Omit<WeeklyReport, "id" | "publishedAt">) {
    const s = this.snapshots.get(candidateId);
    if (!s) return;
    const at = this.tick();
    const id = this.id("rep");
    s.reports.push({ ...report, id, publishedAt: at });
    this.log(s, { type: "report.published", actor: "consultant", title: `Weekly report — week ${report.week}`, reportId: id }, at);
    this.emit();
  }
}
