/**
 * The one interface every workspace screen talks to.
 *
 * Phase A ships `MockDataProvider` (sample journey, in memory). Phase B adds
 * `ApiDataProvider`, which implements the same methods against VisLuck's
 * backend (docs/API.md) — screens do not change.
 */
import type { InterviewDebrief, NotificationSettings, Preferences, WorkspaceSnapshot } from "./types";

export interface WorkspaceLoad {
  snapshot: WorkspaceSnapshot;
  /** The moment the workspace is viewed at — the real clock in production, the scenario clock in the demo. */
  now: string;
}

export interface WorkspaceData {
  load(): Promise<WorkspaceLoad>;
  /** Fires whenever data changes (a mutation, a poll, a push). The context reloads on every call. */
  subscribe(listener: () => void): () => void;

  completeTask(taskId: string): Promise<void>;
  confirmInterview(interviewId: string): Promise<void>;
  saveStarAnswer(interviewId: string, index: number, answer: string): Promise<void>;
  submitDebrief(interviewId: string, debrief: Omit<InterviewDebrief, "submittedAt">): Promise<void>;
  decideOpportunity(opportunityId: string, decision: "approved" | "declined", reason?: string): Promise<void>;
  approveDocumentVersion(documentId: string, versionId: string): Promise<void>;
  commentOnDocument(documentId: string, versionId: string, comment: string): Promise<void>;
  sendMessage(body: string, applicationId?: string): Promise<void>;
  updatePreferences(preferences: Preferences): Promise<void>;
  updateNotifications(settings: NotificationSettings): Promise<void>;
  /** Records that the candidate has seen the workspace; resets "since your last visit". */
  markSeen(): Promise<void>;
  requestDataExport(): Promise<void>;
  requestAccountDeletion(): Promise<void>;
}
