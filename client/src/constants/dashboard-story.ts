import { DASHBOARD_SAMPLE, type ApplicationStatus } from "./dashboard";

/**
 * The hero dashboard "story": four cumulative scenes that show the service doing its job.
 * Everything here is fictional sample data (see dashboard.ts).
 */
export const SCENE_DURATION_MS = 4500;

export const STORY_SCENES = [
  { id: "apply", label: "Apply", caption: "A tailored application goes out." },
  { id: "shortlist", label: "Shortlist", caption: "An employer moves you forward." },
  { id: "interview", label: "Interview", caption: "An interview lands in your diary." },
  { id: "followup", label: "Follow-up", caption: "Next actions stay on schedule." },
] as const;

export type StoryRow = {
  id: string;
  company: string;
  role: string;
  applied: string;
  status: ApplicationStatus;
  statusLabel: string;
  recruiter: string;
  interview: string;
  next: string;
};

export type StoryState = {
  kpis: { key: string; label: string; value: number; delta: string }[];
  rows: StoryRow[];
  nextActions: { title: string; when: string }[];
  pipeline: { stage: string; count: number }[];
  toast: { title: string; detail: string } | null;
  changedRowId: string | null;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function baseState(): StoryState {
  return {
    kpis: DASHBOARD_SAMPLE.kpis.map((k) => ({ ...k })),
    rows: DASHBOARD_SAMPLE.applications.map((r) => ({ id: slug(r.company), ...r })),
    nextActions: DASHBOARD_SAMPLE.nextActions.map((a) => ({ ...a })),
    pipeline: DASHBOARD_SAMPLE.pipeline.map((p) => ({ ...p })),
    toast: null,
    changedRowId: null,
  };
}

const bump = (s: StoryState, key: string, by: number, delta: string) => {
  const k = s.kpis.find((x) => x.key === key);
  if (k) {
    k.value += by;
    k.delta = delta;
  }
};
const row = (s: StoryState, id: string) => s.rows.find((r) => r.id === id)!;

const patches: ((s: StoryState) => void)[] = [
  // Apply: a new tailored application is sent.
  (s) => {
    s.rows.unshift({
      id: "fenwick-hale",
      company: "Fenwick & Hale",
      role: "Marketing Manager",
      applied: "Today",
      status: "neutral",
      statusLabel: "Applied",
      recruiter: "In-house",
      interview: "—",
      next: "Tailored CV sent",
    });
    bump(s, "applications", 1, "+4 this week");
    bump(s, "pending", 1, "awaiting reply");
    s.pipeline[0].count += 1;
    s.toast = { title: "Application sent", detail: "Fenwick & Hale · Marketing Manager" };
    s.changedRowId = "fenwick-hale";
  },
  // Shortlisted: an employer progresses a pending application.
  (s) => {
    const r = row(s, "greystone-health");
    r.status = "progressing";
    r.statusLabel = "Shortlisted";
    r.next = "Await stage-2 invite";
    bump(s, "shortlisted", 1, "+2 this week");
    bump(s, "pending", -1, "awaiting reply");
    s.pipeline[1].count += 1;
    s.toast = { title: "Shortlisted", detail: "Greystone Health · Data Engineer" };
    s.changedRowId = r.id;
  },
  // Interview: a shortlisted role books an interview; prep goes on the list.
  (s) => {
    const r = row(s, "northbridge-consulting");
    r.status = "scheduled";
    r.statusLabel = "Interview booked";
    r.interview = "Tue 23 Sep, 11:00";
    r.next = "Prepare STAR examples";
    bump(s, "interviews", 1, "3 upcoming");
    s.pipeline[2].count += 1;
    s.nextActions.unshift({ title: "Interview prep — Northbridge Consulting", when: "Mon 22 Sep" });
    s.toast = { title: "Interview scheduled", detail: "Northbridge Consulting · Tue 23 Sep, 11:00" };
    s.changedRowId = r.id;
  },
  // Follow-up: a reminder is scheduled for a quiet application.
  (s) => {
    const r = row(s, "lumen-retail-group");
    r.next = "Follow up Fri 19 Sep";
    bump(s, "followups", 1, "3 due Friday");
    s.nextActions.unshift({ title: "Follow up — Lumen Retail Group", when: "Fri 19 Sep" });
    s.toast = { title: "Follow-up due", detail: "Lumen Retail Group · Fri 19 Sep" };
    s.changedRowId = r.id;
  },
];

/** Cumulative state after playing scenes 0..scene. */
export function storyState(scene: number): StoryState {
  const s = baseState();
  for (let i = 0; i <= Math.min(scene, patches.length - 1); i++) patches[i](s);
  return s;
}
