export const DASHBOARD_SECTION = {
  eyebrow: "Your dashboard",
  title: "Your Job Search. One Dashboard. Complete Visibility.",
  noMore: ["No more spreadsheets.", "No more searching through emails.", "No more asking:"],
  quote: "“Where did you apply for me?”",
  body: "Your personalised VisLuck dashboard keeps your job search organised in one place.",
  canShowIntro: "Dashboard can show:",
  metrics: [
    { label: "Applications", description: "Total applications submitted" },
    { label: "Shortlisted", description: "Roles progressing to the next stage" },
    { label: "Interviews", description: "Upcoming & completed interviews" },
    { label: "Pending", description: "Applications awaiting responses" },
    { label: "Follow-ups", description: "Next actions and follow-up dates" },
  ],
  visibilityIntro: "Application-level visibility:",
  columns: ["Company", "Role", "Application Date", "Status", "Recruiter", "Interview Date", "Next Action"],
  closing: "Know where you are. Know what’s next.",
} as const;

export const TRANSPARENCY = {
  eyebrow: "Transparency",
  title: "No False Promises. Just a Better Process.",
  lead: "We believe candidates deserve clarity.",
  statements: [
    "We do not guarantee a job, interview or employment offer.",
    "Hiring decisions ultimately remain with employers.",
  ],
  provideIntro: "What we do provide:",
  provide: [
    "Professional profile support",
    "Relevant opportunity research",
    "Structured application support",
    "Application tracking",
    "Interview preparation",
    "Ongoing guidance",
    "Transparent communication",
  ],
  closing: [
    "Our goal is not to promise an outcome we cannot control.",
    "Our goal is to help you approach the process professionally.",
  ],
} as const;

export const FINAL_CTA = {
  title: "Your Next Opportunity Starts With a Better Strategy.",
  lines: [
    "Don’t leave your UK job search to guesswork.",
    "Get professional support, structured applications and visibility throughout your journey.",
  ],
  footnote: "Let’s talk about your career goals.",
} as const;
