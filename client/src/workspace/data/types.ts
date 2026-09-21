/**
 * Candidate Workspace — domain types.
 *
 * This file is the contract between the workspace UI and VisLuck's backend
 * (see docs/API.md). Every screen renders from these shapes and nothing else,
 * so the backend can be swapped in behind `WorkspaceData` without UI changes.
 *
 * Dates are ISO-8601 strings in UTC ("2026-10-14T09:30:00.000Z"); the UI
 * formats them in en-GB / Europe/London.
 */

export type ISODateTime = string;
export type ISODate = string;

export type Role = "candidate" | "consultant" | "admin";

/* ------------------------------------------------------------------ People */

export interface Consultant {
  id: string;
  name: string;
  initials: string;
  title: string;
  /** Reply promise shown on the consultant card. */
  replySla: string;
  lastActiveAt: ISODateTime;
  email: string;
  whatsappHref?: string;
}

export type CandidateStatus = "onboarding" | "active" | "placed" | "paused";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  currentTitle: string;
  yearsExperience: string;
  consultantId: string;
  status: CandidateStatus;
  /** Monday the search plan starts. */
  searchStartedAt: ISODate;
  /** Last time the candidate opened the workspace — drives "since your last visit". */
  lastSeenAt: ISODateTime;
  onboarding: { completedSteps: OnboardingStep[] };
  preferences: Preferences;
  placement?: Placement;
}

export type OnboardingStep = "details" | "documents" | "targets" | "availability" | "notifications";

export type WorkMode = "On-site" | "Hybrid" | "Remote";

export interface Preferences {
  targetRoles: string[];
  locations: string[];
  workModes: WorkMode[];
  /** Kept private to VisLuck — never shown to employers. */
  salaryFloor?: number;
  sponsorshipRequired: boolean;
  noticePeriod: string;
  /** approve-first: every application waits for the candidate's OK. trusted: the consultant applies within the agreed targets. */
  approvalMode: "approve-first" | "trusted";
}

export interface Placement {
  applicationId: string;
  company: string;
  role: string;
  acceptedAt: ISODateTime;
  startsOn: ISODate;
}

/* ------------------------------------------------------------- Search plan */

export interface SearchPlanWeek {
  week: number;
  startsOn: ISODate;
  title: string;
  focus: string;
  milestone?: string;
}

/* ------------------------------------------------------------ Applications */

export type ApplicationStage = "applied" | "shortlisted" | "interview" | "offer" | "closed";

export type ClosedReason = "no-response" | "unsuccessful" | "withdrawn" | "role-paused" | "offer-declined";

export type ApplicationSource = "LinkedIn" | "Company site" | "Job board" | "Recruiter" | "Referral";

export interface StageChange {
  stage: ApplicationStage;
  at: ISODateTime;
  reason?: ClosedReason;
  note?: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  workMode: WorkMode;
  source: ApplicationSource;
  jobUrl?: string;
  salaryRange?: string;
  recruiter?: { name: string; org: string };
  sentAt: ISODateTime;
  /** Which CV version went with this application. */
  cvVersionId: string;
  coverNote?: string;
  /** Append-only stage history; the current stage is the last entry at or before "now". */
  history: StageChange[];
  notes: { at: ISODateTime; by: "consultant" | "candidate"; body: string }[];
}

/* ------------------------------------------------------------------ Events */

/**
 * The append-only activity log. Everything the team does for a candidate is an
 * event; the activity feed, the "since your last visit" strip and every KPI
 * derive from this list. Never edit or delete an event — append a correction.
 */
export type EventType =
  | "kickoff.completed"
  | "candidate.onboarded"
  | "note.added"
  | "opportunity.added"
  | "opportunity.decided"
  | "application.sent"
  | "application.viewed"
  | "followup.sent"
  | "employer.replied"
  | "stage.changed"
  | "interview.scheduled"
  | "interview.completed"
  | "interview.feedback"
  | "offer.received"
  | "offer.accepted"
  | "document.versioned"
  | "document.approved"
  | "task.assigned"
  | "task.completed"
  | "message.sent"
  | "report.published"
  | "preferences.updated"
  | "milestone";

export type Actor = "consultant" | "candidate" | "employer" | "system";

export interface ActivityEvent {
  id: string;
  type: EventType;
  at: ISODateTime;
  actor: Actor;
  title: string;
  detail?: string;
  applicationId?: string;
  interviewId?: string;
  documentId?: string;
  taskId?: string;
  opportunityId?: string;
  reportId?: string;
}

/* ------------------------------------------------------------------- Tasks */

export type TaskOwner = "candidate" | "consultant";

export type TaskKind =
  | "approve-cv"
  | "confirm-interview"
  | "prep"
  | "debrief"
  | "review-opportunities"
  | "followup"
  | "research"
  | "check-in"
  | "custom";

export interface Task {
  id: string;
  title: string;
  detail?: string;
  owner: TaskOwner;
  kind: TaskKind;
  createdAt: ISODateTime;
  dueAt: ISODateTime;
  completedAt?: ISODateTime;
  applicationId?: string;
  interviewId?: string;
  documentId?: string;
}

/* -------------------------------------------------------------- Interviews */

export type InterviewFormat = "Video" | "In person" | "Phone";

export interface InterviewPrep {
  companyBrief: string[];
  roleBrief: string[];
  likelyQuestions: string[];
  /** STAR prompts the candidate fills in; answers are saved per interview. */
  starPrompts: string[];
  checklist: string[];
}

export interface InterviewDebrief {
  submittedAt: ISODateTime;
  rating: 1 | 2 | 3 | 4 | 5;
  wentWell: string;
  questionsAsked: string;
  concerns: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  stageLabel: string;
  at: ISODateTime;
  durationMinutes: number;
  format: InterviewFormat;
  /** Video link or address. */
  where: string;
  interviewers: string[];
  scheduledAt: ISODateTime;
  confirmedAt?: ISODateTime;
  prep: InterviewPrep;
  starAnswers: Record<number, string>;
  debrief?: InterviewDebrief;
  feedback?: { at: ISODateTime; summary: string; outcome: "progressed" | "unsuccessful" | "pending" };
}

/* --------------------------------------------------------------- Documents */

export type DocumentKind = "cv" | "cover-letter" | "linkedin";

export type DocumentVersionStatus = "draft" | "awaiting-approval" | "approved" | "superseded";

export interface DocumentVersion {
  id: string;
  version: number;
  createdAt: ISODateTime;
  changeNote: string;
  status: DocumentVersionStatus;
  approvedAt?: ISODateTime;
  /** Short-lived signed download URL from the backend (absent in the demo). */
  downloadUrl?: string;
  fileName: string;
}

export interface CandidateDocument {
  id: string;
  kind: DocumentKind;
  title: string;
  versions: DocumentVersion[];
}

/* ----------------------------------------------------------- Opportunities */

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  location: string;
  workMode: WorkMode;
  salaryRange?: string;
  whyFit: string;
  jobUrl?: string;
  addedAt: ISODateTime;
  decision?: { decision: "approved" | "declined"; reason?: string; at: ISODateTime };
  /** Set once the approved opportunity becomes an application. */
  applicationId?: string;
}

/* ---------------------------------------------------------------- Messages */

export interface Message {
  id: string;
  from: "candidate" | "consultant";
  at: ISODateTime;
  body: string;
  applicationId?: string;
}

/* ---------------------------------------------------------- Weekly reports */

export interface WeeklyReport {
  id: string;
  week: number;
  weekStartsOn: ISODate;
  publishedAt: ISODateTime;
  did: string[];
  happened: string[];
  next: string[];
  note?: string;
  numbers: { applications: number; replies: number; interviews: number; followups: number };
}

/* ---------------------------------------------------------------- Settings */

export interface NotificationSettings {
  instant: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  channels: { email: boolean; whatsapp: boolean };
}

/* ----------------------------------------------------------------- Snapshot */

/** Everything the workspace needs for one candidate — what GET /me/workspace returns. */
export interface WorkspaceSnapshot {
  candidate: Candidate;
  consultant: Consultant;
  searchPlan: SearchPlanWeek[];
  applications: Application[];
  events: ActivityEvent[];
  tasks: Task[];
  interviews: Interview[];
  documents: CandidateDocument[];
  opportunities: Opportunity[];
  messages: Message[];
  reports: WeeklyReport[];
  notifications: NotificationSettings;
}
