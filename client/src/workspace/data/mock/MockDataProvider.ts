/**
 * In-memory WorkspaceData for the demo and the Phase A prototype.
 * Mutations append events exactly as the backend will, so the activity log,
 * KPIs and "since your last visit" respond to what the visitor does.
 */
import type { WorkspaceData, WorkspaceLoad } from "../provider";
import type { ActivityEvent, InterviewDebrief, NotificationSettings, Preferences, WorkspaceSnapshot } from "../types";
import { buildJourney, SCENARIOS, type Scenario, type ScenarioId } from "./journey";

export class MockDataProvider implements WorkspaceData {
  readonly scenario: Scenario;
  private snapshot: WorkspaceSnapshot;
  private clock: number;
  private seq = 900;
  private listeners = new Set<() => void>();

  constructor(scenarioId: ScenarioId = "week5") {
    this.scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
    const { snapshot, viewedAt } = buildJourney(this.scenario);
    this.snapshot = snapshot;
    this.clock = new Date(viewedAt).getTime();
  }

  get now(): string {
    return new Date(this.clock).toISOString();
  }

  async load(): Promise<WorkspaceLoad> {
    return { snapshot: this.snapshot, now: this.now };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /* -------------------------------------------------------------- helpers */

  /** Each mutation happens "a minute later" so appended events sort after existing ones. */
  private tick(): string {
    this.clock += 60_000;
    return this.now;
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private log(e: Omit<ActivityEvent, "id" | "at">, at: string) {
    this.snapshot.events.push({ id: `ev-${++this.seq}`, at, ...e });
  }

  private app(id?: string) {
    return this.snapshot.applications.find((a) => a.id === id);
  }

  /* ------------------------------------------------------------ mutations */

  async completeTask(taskId: string) {
    const t = this.snapshot.tasks.find((x) => x.id === taskId);
    if (!t || t.completedAt) return;
    const at = this.tick();
    t.completedAt = at;
    this.log({ type: "task.completed", actor: "candidate", title: `Done — ${t.title}`, taskId, applicationId: t.applicationId, interviewId: t.interviewId }, at);
    this.emit();
  }

  async confirmInterview(interviewId: string) {
    const i = this.snapshot.interviews.find((x) => x.id === interviewId);
    if (!i || i.confirmedAt) return;
    const at = this.tick();
    i.confirmedAt = at;
    const task = this.snapshot.tasks.find((t) => t.interviewId === interviewId && t.kind === "confirm-interview" && !t.completedAt);
    if (task) task.completedAt = at;
    const app = this.app(i.applicationId);
    this.log({ type: "task.completed", actor: "candidate", title: `Interview confirmed — ${app?.company ?? ""}`, applicationId: i.applicationId, interviewId, taskId: task?.id }, at);
    this.emit();
  }

  async saveStarAnswer(interviewId: string, index: number, answer: string) {
    const i = this.snapshot.interviews.find((x) => x.id === interviewId);
    if (!i) return;
    i.starAnswers = { ...i.starAnswers, [index]: answer };
    this.emit();
  }

  async submitDebrief(interviewId: string, debrief: Omit<InterviewDebrief, "submittedAt">) {
    const i = this.snapshot.interviews.find((x) => x.id === interviewId);
    if (!i) return;
    const at = this.tick();
    i.debrief = { ...debrief, submittedAt: at };
    const task = this.snapshot.tasks.find((t) => t.interviewId === interviewId && t.kind === "debrief" && !t.completedAt);
    if (task) task.completedAt = at;
    const app = this.app(i.applicationId);
    this.log({ type: "task.completed", actor: "candidate", title: `Debrief submitted — ${app?.company ?? ""}`, detail: `Rated ${debrief.rating}/5.`, applicationId: i.applicationId, interviewId, taskId: task?.id }, at);
    // The consultant reads every debrief; in the demo the reply arrives straight away.
    const reply = this.tick();
    this.snapshot.messages.push({ id: `m-${++this.seq}`, from: "consultant", at: reply, body: `Thanks for the debrief on ${app?.company ?? "the interview"} — I will use it in the thank-you note and let you know as soon as I hear back.`, applicationId: i.applicationId });
    this.emit();
  }

  async decideOpportunity(opportunityId: string, decision: "approved" | "declined", reason?: string) {
    const o = this.snapshot.opportunities.find((x) => x.id === opportunityId);
    if (!o || o.decision) return;
    const at = this.tick();
    o.decision = { decision, reason, at };
    this.log({
      type: "opportunity.decided", actor: "candidate", opportunityId,
      title: `${o.company} ${decision === "approved" ? "approved" : "declined"} — ${o.role}`,
      detail: decision === "approved" ? "Daniel will tailor the application and send it within two working days." : reason ? `Reason: ${reason}. Targeting updated.` : "Targeting updated.",
    }, at);
    const stillPending = this.snapshot.opportunities.some((x) => !x.decision && x.addedAt <= at);
    if (!stillPending) {
      const task = this.snapshot.tasks.find((t) => t.kind === "review-opportunities" && !t.completedAt && t.createdAt <= at);
      if (task) task.completedAt = at;
    }
    this.emit();
  }

  async approveDocumentVersion(documentId: string, versionId: string) {
    const d = this.snapshot.documents.find((x) => x.id === documentId);
    const v = d?.versions.find((x) => x.id === versionId);
    if (!d || !v || v.status === "approved") return;
    const at = this.tick();
    v.status = "approved";
    v.approvedAt = at;
    const task = this.snapshot.tasks.find((t) => t.documentId === documentId && t.kind === "approve-cv" && !t.completedAt);
    if (task) task.completedAt = at;
    this.log({ type: "document.approved", actor: "candidate", title: `${d.title} v${v.version} approved`, documentId, taskId: task?.id }, at);
    this.emit();
  }

  async commentOnDocument(documentId: string, versionId: string, comment: string) {
    const d = this.snapshot.documents.find((x) => x.id === documentId);
    const v = d?.versions.find((x) => x.id === versionId);
    if (!d || !v) return;
    const at = this.tick();
    this.snapshot.messages.push({ id: `m-${++this.seq}`, from: "candidate", at, body: `On ${d.title} v${v.version}: ${comment}` });
    this.log({ type: "message.sent", actor: "candidate", title: `Comment on ${d.title} v${v.version}`, detail: comment, documentId }, at);
    this.emit();
  }

  async sendMessage(body: string, applicationId?: string) {
    const at = this.tick();
    this.snapshot.messages.push({ id: `m-${++this.seq}`, from: "candidate", at, body, applicationId });
    this.log({ type: "message.sent", actor: "candidate", title: "Message sent to Daniel", detail: body, applicationId }, at);
    this.emit();
  }

  async updatePreferences(preferences: Preferences) {
    const at = this.tick();
    this.snapshot.candidate.preferences = preferences;
    this.log({ type: "preferences.updated", actor: "candidate", title: "Preferences updated", detail: "Daniel has been notified and will adjust the target list." }, at);
    this.emit();
  }

  async updateNotifications(settings: NotificationSettings) {
    this.snapshot.notifications = settings;
    this.emit();
  }

  async markSeen() {
    this.snapshot.candidate.lastSeenAt = this.now;
    this.emit();
  }

  async requestDataExport() {
    const at = this.tick();
    this.log({ type: "note.added", actor: "system", title: "Data export requested", detail: "A copy of your workspace data will be emailed within 24 hours." }, at);
    this.emit();
  }

  async requestAccountDeletion() {
    const at = this.tick();
    this.log({ type: "note.added", actor: "system", title: "Account deletion requested", detail: "Your consultant will confirm within one business day; data is erased 30 days after the search closes." }, at);
    this.emit();
  }
}
