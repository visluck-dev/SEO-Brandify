/**
 * Sample data for the illustrative candidate dashboard.
 * Every company, person and date here is fictional and the UI is captioned as such.
 */
export const DASHBOARD_SAMPLE = {
  candidate: "Amelia R.",
  week: "Week of 15 Sep",
  kpis: [
    { key: "applications", label: "Applications", value: 24, delta: "+3 this week" },
    { key: "shortlisted", label: "Shortlisted", value: 6, delta: "+1 this week" },
    { key: "interviews", label: "Interviews", value: 3, delta: "2 upcoming" },
    { key: "pending", label: "Pending", value: 11, delta: "awaiting reply" },
    { key: "followups", label: "Follow-ups", value: 4, delta: "2 due Friday" },
  ],
  pipeline: [
    { stage: "Applied", count: 24 },
    { stage: "Shortlisted", count: 6 },
    { stage: "Interview", count: 3 },
    { stage: "Offer", count: 1 },
  ],
  applications: [
    { company: "Halcyon Digital", role: "Senior Business Analyst", applied: "10 Sep", status: "scheduled", statusLabel: "Interview booked", recruiter: "Priya S.", interview: "Thu 18 Sep, 10:00", next: "Prepare STAR examples" },
    { company: "Northbridge Consulting", role: "Product Manager", applied: "08 Sep", status: "progressing", statusLabel: "Shortlisted", recruiter: "In-house", interview: "—", next: "Await stage-2 invite" },
    { company: "Greystone Health", role: "Data Engineer", applied: "11 Sep", status: "waiting", statusLabel: "Pending", recruiter: "James W.", interview: "—", next: "Follow up Fri 19 Sep" },
    { company: "Ashworth & Vale", role: "HR Business Partner", applied: "05 Sep", status: "progressing", statusLabel: "Shortlisted", recruiter: "Aisha K.", interview: "Mon 22 Sep, 14:30", next: "Company research" },
    { company: "Lumen Retail Group", role: "Project Manager", applied: "12 Sep", status: "neutral", statusLabel: "Applied", recruiter: "In-house", interview: "—", next: "Tailored CV sent" },
  ],
  nextActions: [
    { title: "Interview prep — Halcyon Digital", when: "Wed 17 Sep" },
    { title: "Follow up — Greystone Health", when: "Fri 19 Sep" },
    { title: "Research — Ashworth & Vale", when: "Sat 20 Sep" },
  ],
  toast: { title: "Interview scheduled", detail: "Halcyon Digital · Thu 18 Sep, 10:00" },
  caption: "Illustrative dashboard — sample data",
} as const;

export type ApplicationStatus = "scheduled" | "progressing" | "waiting" | "neutral";
