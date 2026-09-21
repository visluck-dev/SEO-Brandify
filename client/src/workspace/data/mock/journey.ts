/**
 * Sample candidate journey for the demo workspace and the Phase A prototype.
 *
 * Every person, company, role and date here is fictional. The journey is written
 * as day offsets from a kick-off Monday; `buildJourney` pins that Monday relative
 * to the real calendar so the sample always looks current, and the scenario
 * decides which "day" the workspace is viewed on. Everything after that moment
 * is filtered out by `deriveState`, so one journey powers three moments:
 * week 1 (just onboarded), week 5 (mid-search) and after placement.
 */
import type {
  ActivityEvent,
  Application,
  CandidateDocument,
  EventType,
  Interview,
  Message,
  Opportunity,
  SearchPlanWeek,
  Task,
  TaskKind,
  TaskOwner,
  WeeklyReport,
  WorkspaceSnapshot,
  Actor,
} from "../types";

export type ScenarioId = "week1" | "week5" | "placed";

export interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  /** Weeks between the real current week and the kick-off Monday. */
  kickoffWeeksAgo: number;
  /** The moment the workspace is viewed at, as a day offset + London wall-clock time. */
  viewedAt: { day: number; time: string };
  /** Last time the sample candidate opened the workspace before `viewedAt`. */
  lastSeen: { day: number; time: string };
}

export const SCENARIOS: readonly Scenario[] = [
  { id: "week1", label: "Week 1", description: "Just onboarded — nothing has been sent yet, and nothing is empty.", kickoffWeeksAgo: 0, viewedAt: { day: 2, time: "10:30" }, lastSeen: { day: 0, time: "17:45" } },
  { id: "week5", label: "Week 5", description: "Mid-search — ten applications, two interviews this week.", kickoffWeeksAgo: 4, viewedAt: { day: 30, time: "10:30" }, lastSeen: { day: 28, time: "18:00" } },
  { id: "placed", label: "After placement", description: "Offer accepted — the workspace switches to alumni mode.", kickoffWeeksAgo: 10, viewedAt: { day: 72, time: "10:30" }, lastSeen: { day: 68, time: "19:10" } },
];

/* ------------------------------------------------------------ Time helpers */

const DAY = 86_400_000;

/** Minutes to add to a UTC instant to get Europe/London wall-clock time (0 or 60). */
function londonOffsetMinutes(t: number): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(t));
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour") % 24, n("minute"));
  return Math.round((asUtc - t) / 60_000);
}

/** Monday 00:00 (London) of the week containing `now`, shifted back `weeksAgo` weeks. */
export function kickoffMonday(now: Date, weeksAgo: number): number {
  const local = now.getTime() + londonOffsetMinutes(now.getTime()) * 60_000;
  const d = new Date(local);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  const mondayUtcMidnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow - weeksAgo * 7);
  return mondayUtcMidnight - londonOffsetMinutes(mondayUtcMidnight) * 60_000;
}

/** ISO instant for `day` days after kick-off at London wall-clock `hm`. */
function makeClock(kickoff: number) {
  return (day: number, hm = "09:00"): string => {
    const [h, m] = hm.split(":").map(Number);
    const naive = kickoff + day * DAY + (h * 60 + m) * 60_000;
    // kickoff is London midnight; correct for a DST change between kick-off and `day`.
    const drift = londonOffsetMinutes(kickoff) - londonOffsetMinutes(naive);
    return new Date(naive + drift * 60_000).toISOString();
  };
}

export function viewedAtFor(scenario: Scenario, now = new Date()): string {
  return makeClock(kickoffMonday(now, scenario.kickoffWeeksAgo))(scenario.viewedAt.day, scenario.viewedAt.time);
}

/* ------------------------------------------------------------- The journey */

export function buildJourney(scenario: Scenario, now = new Date()): { snapshot: WorkspaceSnapshot; viewedAt: string } {
  const kickoff = kickoffMonday(now, scenario.kickoffWeeksAgo);
  const at = makeClock(kickoff);
  // London calendar date for day `d` (noon avoids the BST/GMT midnight shift when slicing the UTC string).
  const day = (d: number) => at(d, "12:00").slice(0, 10);
  const viewedAt = at(scenario.viewedAt.day, scenario.viewedAt.time);

  /* Applications — fictional UK employers. `history` is append-only. */
  const applications: Application[] = [
    {
      id: "app-01", company: "Ashworth & Vale", role: "Senior Business Analyst", location: "London", workMode: "Hybrid", source: "Company site",
      jobUrl: "https://example.com/ashworth-vale/senior-business-analyst", salaryRange: "£62,000–£68,000", recruiter: { name: "Aisha K.", org: "Ashworth & Vale (in-house)" },
      sentAt: at(9, "10:20"), cvVersionId: "cv-v2", coverNote: "Supporting statement focused on finance-systems discovery and stakeholder facilitation.",
      history: [
        { stage: "applied", at: at(9, "10:20") },
        { stage: "shortlisted", at: at(17, "11:40"), note: "Hiring manager wants a first conversation." },
        { stage: "interview", at: at(23, "16:05"), note: "Stage 1 booked." },
        { stage: "offer", at: at(39, "15:30"), note: "Verbal offer, written terms to follow." },
      ],
      notes: [{ at: at(9, "10:25"), by: "consultant", body: "Applied via the careers portal with the finance-systems supporting statement. Aisha K. confirmed receipt the same day." }],
    },
    {
      id: "app-02", company: "Lumen Retail Group", role: "Product Owner", location: "Reading", workMode: "Hybrid", source: "LinkedIn",
      jobUrl: "https://example.com/lumen/product-owner", salaryRange: "£58,000–£64,000", sentAt: at(10, "09:45"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(10, "09:45") },
        { stage: "closed", at: at(25, "14:10"), reason: "role-paused", note: "Recruiter confirmed the role is on hold until the new financial year." },
      ],
      notes: [],
    },
    {
      id: "app-03", company: "Greystone Health", role: "Business Analyst (Digital)", location: "Oxford", workMode: "Hybrid", source: "Recruiter",
      jobUrl: "https://example.com/greystone/business-analyst-digital", salaryRange: "£55,000–£62,000", recruiter: { name: "James W.", org: "Greystone Health" },
      sentAt: at(11, "11:15"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(11, "11:15") },
        { stage: "closed", at: at(50, "10:00"), reason: "no-response", note: "No response after three follow-ups; closed to keep the pipeline honest." },
      ],
      notes: [],
    },
    {
      id: "app-04", company: "Northbridge Consulting", role: "Product Manager", location: "London", workMode: "Hybrid", source: "Company site",
      jobUrl: "https://example.com/northbridge/product-manager", salaryRange: "£65,000–£72,000", sentAt: at(11, "16:00"), cvVersionId: "cv-v2",
      coverNote: "Positioned the BA-to-product move around backlog ownership on the claims platform.",
      history: [
        { stage: "applied", at: at(11, "16:00") },
        { stage: "shortlisted", at: at(28, "15:00"), note: "Hiring manager would like to progress." },
        { stage: "interview", at: at(35, "10:00"), note: "Stage 2 panel booked." },
        { stage: "closed", at: at(46, "12:00"), reason: "withdrawn", note: "Withdrawn after accepting Ashworth & Vale." },
      ],
      notes: [],
    },
    {
      id: "app-05", company: "Halcyon Digital", role: "Senior Business Analyst", location: "London", workMode: "Hybrid", source: "Recruiter",
      jobUrl: "https://example.com/halcyon/senior-business-analyst", salaryRange: "£60,000–£66,000", recruiter: { name: "Priya S.", org: "Halcyon Digital" },
      sentAt: at(14, "10:00"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(14, "10:00") },
        { stage: "shortlisted", at: at(22, "12:30"), note: "Recruiter screen passed." },
        { stage: "interview", at: at(28, "09:00"), note: "Stage 1 booked." },
        { stage: "closed", at: at(45, "16:20"), reason: "unsuccessful", note: "Strong feedback; they appointed an internal candidate." },
      ],
      notes: [],
    },
    {
      id: "app-06", company: "Fenwick & Hale", role: "Business Analyst, Payments", location: "London", workMode: "On-site", source: "Recruiter",
      jobUrl: "https://example.com/fenwick-hale/business-analyst-payments", salaryRange: "£58,000–£63,000", recruiter: { name: "Tom B.", org: "Fenwick & Hale" },
      sentAt: at(15, "14:30"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(15, "14:30") },
        { stage: "shortlisted", at: at(32, "09:30"), note: "Invited to a recruiter call." },
        { stage: "closed", at: at(46, "12:05"), reason: "withdrawn", note: "Withdrawn after accepting Ashworth & Vale." },
      ],
      notes: [],
    },
    {
      id: "app-07", company: "Orbital Energy", role: "Product Owner", location: "Bristol", workMode: "Remote", source: "Job board",
      jobUrl: "https://example.com/orbital/product-owner", salaryRange: "£60,000–£65,000", sentAt: at(16, "11:00"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(16, "11:00") },
        { stage: "closed", at: at(44, "09:00"), reason: "no-response", note: "No response after two follow-ups." },
      ],
      notes: [],
    },
    {
      id: "app-08", company: "Marlow & Finch", role: "Product Owner", location: "London", workMode: "Hybrid", source: "LinkedIn",
      jobUrl: "https://example.com/marlow-finch/product-owner", salaryRange: "£62,000–£70,000", sentAt: at(21, "10:10"), cvVersionId: "cv-v2",
      coverNote: "Product Owner variant of the supporting statement.",
      history: [
        { stage: "applied", at: at(21, "10:10") },
        { stage: "closed", at: at(46, "12:10"), reason: "withdrawn", note: "Withdrawn after accepting Ashworth & Vale." },
      ],
      notes: [],
    },
    {
      id: "app-09", company: "Kestrel Logistics", role: "Senior Business Analyst", location: "Milton Keynes", workMode: "Hybrid", source: "Company site",
      jobUrl: "https://example.com/kestrel/senior-business-analyst", salaryRange: "£58,000–£64,000", sentAt: at(22, "09:30"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(22, "09:30") },
        { stage: "closed", at: at(46, "12:15"), reason: "withdrawn", note: "Withdrawn after accepting Ashworth & Vale." },
      ],
      notes: [],
    },
    {
      id: "app-10", company: "Bramble & Co", role: "Business Analyst", location: "Reading", workMode: "Hybrid", source: "Job board",
      jobUrl: "https://example.com/bramble/business-analyst", salaryRange: "£52,000–£58,000", sentAt: at(23, "15:20"), cvVersionId: "cv-v2",
      history: [
        { stage: "applied", at: at(23, "15:20") },
        { stage: "closed", at: at(46, "12:20"), reason: "withdrawn", note: "Withdrawn after accepting Ashworth & Vale." },
      ],
      notes: [],
    },
  ];

  /* Search plan — agreed on the kick-off call. */
  const searchPlan: SearchPlanWeek[] = [
    { week: 1, startsOn: day(0), title: "Profile & positioning", focus: "Kick-off call, profile assessment and a UK-format CV rebuilt around your achievements.", milestone: "CV v2 approved" },
    { week: 2, startsOn: day(7), title: "LinkedIn & first applications", focus: "LinkedIn rewritten; the first targeted applications go out once you approve each role.", milestone: "First applications sent" },
    { week: 3, startsOn: day(14), title: "Build the pipeline", focus: "Three more applications and the first round of follow-ups.", milestone: "First employer reply" },
    { week: 4, startsOn: day(21), title: "Momentum", focus: "Applications eight to ten, second follow-ups, interview preparation begins.", milestone: "First interview booked" },
    { week: 5, startsOn: day(28), title: "Interviews", focus: "Two first-stage interviews and a CV tailored for Product Owner roles.", milestone: "Stage-1 interviews completed" },
    { week: 6, startsOn: day(35), title: "Second stages", focus: "Stage-2 interviews while two or three new applications stay live.", milestone: "Stage-2 interview" },
    { week: 7, startsOn: day(42), title: "Decisions", focus: "Offer handling, comparison and questions to ask before you decide.", milestone: "Offer received" },
    { week: 8, startsOn: day(49), title: "Close out", focus: "Accept, withdraw the others gracefully and plan the notice period.", milestone: "Offer accepted" },
  ];

  /* Documents — versions carry the reason for every change. */
  const documents: CandidateDocument[] = [
    {
      id: "doc-cv", kind: "cv", title: "CV",
      versions: [
        { id: "cv-v1", version: 1, createdAt: at(1, "11:00"), changeNote: "Baseline — your CV exactly as received.", status: "superseded", fileName: "Amelia-Rowe-CV-v1.pdf" },
        { id: "cv-v2", version: 2, createdAt: at(3, "16:30"), changeNote: "Restructured to UK format: two pages, achievement-led bullets, summary rewritten for Senior Business Analyst roles.", status: "approved", approvedAt: at(5, "19:20"), fileName: "Amelia-Rowe-CV-v2.pdf" },
        { id: "cv-v3", version: 3, createdAt: at(25, "17:00"), changeNote: "Tailored for Product Owner roles: backlog ownership and delivery outcomes brought forward; tools section trimmed.", status: "awaiting-approval", fileName: "Amelia-Rowe-CV-v3-PO.pdf" },
      ],
    },
    {
      id: "doc-cl", kind: "cover-letter", title: "Supporting statements",
      versions: [
        { id: "cl-v1", version: 1, createdAt: at(8, "12:00"), changeNote: "Senior Business Analyst template — finance and claims systems.", status: "approved", approvedAt: at(8, "18:30"), fileName: "Supporting-statement-Senior-BA.docx" },
        { id: "cl-v2", version: 2, createdAt: at(21, "09:00"), changeNote: "Product Owner variant — backlog ownership and outcome metrics.", status: "approved", approvedAt: at(21, "09:40"), fileName: "Supporting-statement-Product-Owner.docx" },
      ],
    },
    {
      id: "doc-li", kind: "linkedin", title: "LinkedIn profile",
      versions: [
        { id: "li-v1", version: 1, createdAt: at(7, "10:30"), changeNote: "Headline, About and Experience rewritten to match the CV positioning; skills reordered for recruiter search.", status: "approved", approvedAt: at(8, "18:35"), fileName: "LinkedIn-copy-v1.docx" },
      ],
    },
  ];

  /* Opportunities — approve-first mode: every application waits for the candidate's OK. */
  const approved = (d: number, hm: string, applicationId: string) => ({ decision: { decision: "approved" as const, at: at(d, hm) }, applicationId });
  const laterDeclined = (d: number, hm: string) =>
    scenario.id === "placed" ? { decision: { decision: "declined" as const, reason: "Focusing on live interviews", at: at(d, hm) } } : {};
  const opportunities: Opportunity[] = [
    { id: "opp-01", company: "Ashworth & Vale", role: "Senior Business Analyst", location: "London", workMode: "Hybrid", salaryRange: "£62,000–£68,000", whyFit: "Finance-systems change programme; your Hartwell claims-platform discovery work maps directly.", jobUrl: applications[0].jobUrl, addedAt: at(4, "10:00"), ...approved(8, "08:40", "app-01") },
    { id: "opp-02", company: "Lumen Retail Group", role: "Product Owner", location: "Reading", workMode: "Hybrid", salaryRange: "£58,000–£64,000", whyFit: "First Product Owner step close to home; the team runs Scrum the way you described.", jobUrl: applications[1].jobUrl, addedAt: at(4, "10:05"), ...approved(8, "08:42", "app-02") },
    { id: "opp-03", company: "Kingsbridge Council", role: "Business Analyst", location: "Reading", workMode: "On-site", salaryRange: "£46,000–£50,000", whyFit: "Local and stable, but five days on site and below your salary floor.", addedAt: at(4, "10:10"), decision: { decision: "declined", reason: "On-site five days a week", at: at(8, "08:45") } },
    { id: "opp-04", company: "Greystone Health", role: "Business Analyst (Digital)", location: "Oxford", workMode: "Hybrid", salaryRange: "£55,000–£62,000", whyFit: "Patient-portal programme; regulated-sector experience counts here.", jobUrl: applications[2].jobUrl, addedAt: at(8, "09:30"), ...approved(9, "07:50", "app-03") },
    { id: "opp-05", company: "Northbridge Consulting", role: "Product Manager", location: "London", workMode: "Hybrid", salaryRange: "£65,000–£72,000", whyFit: "A stretch into product; the hiring manager came from a BA background.", jobUrl: applications[3].jobUrl, addedAt: at(8, "09:35"), ...approved(9, "07:52", "app-04") },
    { id: "opp-06", company: "Halcyon Digital", role: "Senior Business Analyst", location: "London", workMode: "Hybrid", salaryRange: "£60,000–£66,000", whyFit: "Consultancy pace, retail and utilities clients; Priya S. is actively recruiting.", jobUrl: applications[4].jobUrl, addedAt: at(11, "17:30"), ...approved(14, "08:10", "app-05") },
    { id: "opp-07", company: "Fenwick & Hale", role: "Business Analyst, Payments", location: "London", workMode: "On-site", salaryRange: "£58,000–£63,000", whyFit: "Payments domain is adjacent to claims; on-site, so worth a conversation before deciding.", jobUrl: applications[5].jobUrl, addedAt: at(11, "17:32"), ...approved(14, "08:12", "app-06") },
    { id: "opp-08", company: "Orbital Energy", role: "Product Owner", location: "Bristol", workMode: "Remote", salaryRange: "£60,000–£65,000", whyFit: "Fully remote Product Owner role; energy-sector data platform.", jobUrl: applications[6].jobUrl, addedAt: at(11, "17:34"), ...approved(14, "08:15", "app-07") },
    { id: "opp-09", company: "Marlow & Finch", role: "Product Owner", location: "London", workMode: "Hybrid", salaryRange: "£62,000–£70,000", whyFit: "Product Owner on a small platform team; two days in the office.", jobUrl: applications[7].jobUrl, addedAt: at(18, "16:30"), ...approved(20, "20:10", "app-08") },
    { id: "opp-10", company: "Kestrel Logistics", role: "Senior Business Analyst", location: "Milton Keynes", workMode: "Hybrid", salaryRange: "£58,000–£64,000", whyFit: "Warehouse-management replacement programme; strong process-mapping fit.", jobUrl: applications[8].jobUrl, addedAt: at(18, "16:32"), ...approved(20, "20:12", "app-09") },
    { id: "opp-11", company: "Bramble & Co", role: "Business Analyst", location: "Reading", workMode: "Hybrid", salaryRange: "£52,000–£58,000", whyFit: "Below your floor, but a ten-minute commute and a fast process — your call.", jobUrl: applications[9].jobUrl, addedAt: at(18, "16:34"), ...approved(20, "20:15", "app-10") },
    { id: "opp-12", company: "Wexford Bank", role: "Senior Business Analyst", location: "London", workMode: "Hybrid", salaryRange: "£65,000–£70,000", whyFit: "Regulatory-reporting programme; they want someone who can run discovery workshops with finance.", jobUrl: "https://example.com/wexford/senior-business-analyst", addedAt: at(30, "09:00"), ...laterDeclined(33, "08:30") },
    { id: "opp-13", company: "Tidewater Media", role: "Product Owner", location: "London", workMode: "Hybrid", salaryRange: "£60,000–£65,000", whyFit: "Subscription platform team; the role description reads like your Hartwell backlog work.", jobUrl: "https://example.com/tidewater/product-owner", addedAt: at(30, "09:05"), ...laterDeclined(33, "08:31") },
  ];

  /* Interviews — each carries its own prep kit. Debriefs and outcomes exist only once they have happened. */
  const placed = scenario.id === "placed";
  const starPrompts = [
    "A time you turned a vague request into clear requirements — what did you ask, and what changed?",
    "A stakeholder who disagreed with your analysis — how did you handle it?",
    "A delivery that slipped — what you did, and what you would do differently.",
  ];
  const interviews: Interview[] = [
    {
      id: "int-01", applicationId: "app-01", stageLabel: "Stage 1 — hiring manager", at: at(29, "14:30"), durationMinutes: 45, format: "Video", where: "Microsoft Teams — link in the calendar invite",
      interviewers: ["Rachel Okafor, Head of Change", "Aisha K., Talent Partner"], scheduledAt: at(23, "16:05"), confirmedAt: at(23, "18:02"),
      prep: {
        companyBrief: ["Mid-sized audit and advisory firm, about 1,800 people, London head office.", "Three-year programme replacing the finance and time-recording systems; the Change team owns discovery.", "New Head of Change (Rachel Okafor) joined from a Big Four firm in the spring."],
        roleBrief: ["Senior BA leading discovery for the finance-systems workstream.", "Day to day: workshops with the Finance Director's team, process mapping, requirements for the vendor.", "Hybrid — two days in the London office."],
        likelyQuestions: ["Walk me through how you run a discovery workshop with senior finance stakeholders.", "How do you decide what not to build?", "Tell me about a requirement that was wrong — how did you find out?", "What would your first 30 days here look like?", "How do you work with a vendor's delivery team?"],
        starPrompts,
        checklist: ["Test the Teams link 10 minutes early", "Two questions ready for Rachel about the programme roadmap", "Have the claims-platform discovery example to hand", "Water, notebook, quiet room"],
      },
      starAnswers: { 0: "Hartwell claims triage: three workshops with underwriting, replaced a 40-field form with a 12-field one — handling time down 30%." },
      debrief: placed ? { submittedAt: at(29, "17:30"), rating: 4, wentWell: "The discovery-workshop example landed; Rachel asked follow-ups about vendor management.", questionsAsked: "First 30 days; how I prioritise when finance and IT disagree; an example of saying no.", concerns: "Less confident on the vendor-contract questions." } : undefined,
      feedback: { at: at(31, "16:00"), summary: "Positive — Rachel would like you to meet the Finance Director. Stage 2 next week.", outcome: "progressed" },
    },
    {
      id: "int-02", applicationId: "app-05", stageLabel: "Stage 1 — panel", at: at(31, "10:00"), durationMinutes: 60, format: "Video", where: "Google Meet — link in the calendar invite",
      interviewers: ["Marcus Bell, Practice Lead", "Priya S., Talent Acquisition"], scheduledAt: at(28, "09:00"), confirmedAt: at(28, "12:40"),
      prep: {
        companyBrief: ["Digital product consultancy, roughly 300 people, offices in London and Leeds.", "Clients in retail and utilities; BAs sit inside client delivery teams.", "They publish their delivery playbook — read the discovery chapter."],
        roleBrief: ["Senior BA embedded with a retail client's checkout team.", "Expect a case exercise: a short brief, then how you would approach discovery.", "Hybrid — client site two days a week."],
        likelyQuestions: ["How do you adapt your approach when the client has no product owner?", "Give an example of a process you mapped that changed the solution.", "How do you handle scope pressure from a client who is paying by the day?", "What does a good user story look like to you?"],
        starPrompts,
        checklist: ["Re-read the Halcyon delivery playbook (discovery chapter)", "Prepare the checkout-flow case answer structure", "Test the Meet link", "Questions for Marcus about team composition"],
      },
      starAnswers: {},
      debrief: placed ? { submittedAt: at(31, "12:00"), rating: 3, wentWell: "Case exercise went well — they liked the discovery plan.", questionsAsked: "Scope pressure; working without a product owner; a story-writing example.", concerns: "The panel felt formal; not sure my answers on commercial pressure were strong." } : undefined,
      feedback: placed ? { at: at(45, "16:20"), summary: "Strong feedback on the case exercise; they appointed an internal candidate.", outcome: "unsuccessful" } : undefined,
    },
    {
      id: "int-03", applicationId: "app-01", stageLabel: "Stage 2 — Finance Director", at: at(36, "11:00"), durationMinutes: 45, format: "In person", where: "Ashworth & Vale, 40 Cheapside, London EC2V 6AA",
      interviewers: ["Simon Hartley, Finance Director", "Rachel Okafor, Head of Change"], scheduledAt: at(31, "16:30"), confirmedAt: at(31, "18:15"),
      prep: {
        companyBrief: ["Stage 2 is with the programme sponsor — expect questions about outcomes and budget.", "Simon Hartley has sponsored the programme since it began."],
        roleBrief: ["Same role; this stage decides. Bring the 30-day plan you outlined in stage 1."],
        likelyQuestions: ["How will you know the programme is on track?", "What would you do if the vendor's estimate doubles?", "Why this move now?"],
        starPrompts,
        checklist: ["Print the 30-day plan", "Arrive 15 minutes early — reception on the ground floor", "Ask about decision timelines"],
      },
      starAnswers: {},
      debrief: placed ? { submittedAt: at(36, "14:00"), rating: 5, wentWell: "Simon engaged with the 30-day plan; the conversation about vendor estimates went well.", questionsAsked: "Programme tracking; vendor estimates; why now.", concerns: "None significant." } : undefined,
      feedback: placed ? { at: at(39, "15:30"), summary: "Offer — Senior Business Analyst, £64,000, hybrid two days.", outcome: "progressed" } : undefined,
    },
  ];

  /* Tasks — candidate tasks are the reciprocal actions; consultant tasks surface as "Next action" on each application. */
  type TaskOpts = { done?: [number, string]; applicationId?: string; interviewId?: string; documentId?: string; detail?: string };
  const task = (id: string, created: [number, string], owner: TaskOwner, kind: TaskKind, title: string, due: [number, string], o: TaskOpts = {}): Task => ({
    id, title, detail: o.detail, owner, kind, createdAt: at(...created), dueAt: at(...due),
    completedAt: o.done ? at(...o.done) : undefined, applicationId: o.applicationId, interviewId: o.interviewId, documentId: o.documentId,
  });
  const ifPlaced = (done: [number, string]) => (placed ? { done } : {});
  const candidateTasks: Task[] = [
    task("t-01", [0, "10:00"], "candidate", "custom", "Upload your current CV", [1, "18:00"], { done: [0, "17:30"], detail: "Any format — we rebuild it from here." }),
    task("t-02", [0, "10:00"], "candidate", "custom", "Confirm your target roles and preferences", [2, "18:00"], { done: [1, "08:15"], detail: "Roles, locations, hybrid days, salary floor and notice period." }),
    task("t-03", [0, "10:00"], "candidate", "custom", "Send three achievements you are proud of", [3, "18:00"], { done: [2, "21:40"], detail: "A sentence each is enough — Daniel turns them into CV bullets." }),
    task("t-04", [3, "16:30"], "candidate", "approve-cv", "Review and approve CV v2", [5, "18:00"], { done: [5, "19:20"], documentId: "doc-cv", detail: "Restructured to UK format with achievement-led bullets." }),
    task("t-05", [4, "10:15"], "candidate", "review-opportunities", "Review three opportunities", [6, "18:00"], { done: [8, "08:45"], detail: "Approve the ones you want us to apply to; decline with a reason and we refine the targeting." }),
    task("t-06", [7, "10:30"], "candidate", "approve-cv", "Approve your new LinkedIn copy", [9, "18:00"], { done: [8, "18:35"], documentId: "doc-li" }),
    task("t-07", [23, "16:05"], "candidate", "confirm-interview", "Confirm Tuesday's interview — Ashworth & Vale", [24, "12:00"], { done: [23, "18:02"], applicationId: "app-01", interviewId: "int-01" }),
    task("t-08", [23, "16:10"], "candidate", "prep", "Prepare for Ashworth & Vale — stage 1", [28, "18:00"], { done: [28, "21:00"], applicationId: "app-01", interviewId: "int-01", detail: "Open the prep kit: company brief, likely questions and your STAR bank." }),
    task("t-09", [25, "17:00"], "candidate", "approve-cv", "Review CV v3 — tailored for Product Owner roles", [31, "18:00"], { documentId: "doc-cv", detail: "Backlog ownership and delivery outcomes brought forward. Approve or comment.", ...ifPlaced([29, "08:30"]) }),
    task("t-10", [28, "09:00"], "candidate", "confirm-interview", "Confirm Thursday's interview — Halcyon Digital", [28, "17:00"], { done: [28, "12:40"], applicationId: "app-05", interviewId: "int-02" }),
    task("t-11", [28, "09:05"], "candidate", "prep", "Prepare STAR examples — Halcyon Digital", [30, "18:00"], { applicationId: "app-05", interviewId: "int-02", detail: "Three STAR answers in the prep kit, plus the checkout-flow case structure.", ...ifPlaced([30, "20:15"]) }),
    task("t-12", [29, "16:05"], "candidate", "debrief", "Two-minute debrief — Ashworth & Vale stage 1", [30, "12:00"], { applicationId: "app-01", interviewId: "int-01", detail: "What went well, what they asked, anything you are unsure about. Daniel uses it for the thank-you note.", ...ifPlaced([29, "17:30"]) }),
    task("t-13", [30, "09:05"], "candidate", "review-opportunities", "Review two new opportunities", [32, "18:00"], { detail: "Wexford Bank and Tidewater Media — approve or decline with a reason.", ...ifPlaced([33, "08:31"]) }),
    task("t-14", [31, "16:30"], "candidate", "confirm-interview", "Confirm stage 2 — Ashworth & Vale, in person", [32, "12:00"], { done: [31, "18:15"], applicationId: "app-01", interviewId: "int-03" }),
    task("t-15", [36, "12:00"], "candidate", "debrief", "Two-minute debrief — Ashworth & Vale stage 2", [37, "12:00"], { done: [36, "14:00"], applicationId: "app-01", interviewId: "int-03" }),
    task("t-16", [39, "15:35"], "candidate", "custom", "Review the Ashworth & Vale offer summary", [42, "18:00"], { done: [41, "20:10"], applicationId: "app-01", detail: "Salary, hybrid days, start date and the questions worth asking before you decide." }),
    task("t-17", [46, "12:00"], "candidate", "custom", "Confirm your start date and notice period", [49, "18:00"], { done: [46, "13:05"], applicationId: "app-01" }),
    task("t-18", [70, "09:00"], "candidate", "check-in", "Pre-start checklist", [75, "18:00"], { detail: "Right-to-work documents, references, first-week logistics — five items." }),
    task("t-19", [70, "09:05"], "candidate", "check-in", "30-day check-in with Daniel", [107, "18:00"], { detail: "A 20-minute call about how the first month has gone." }),
  ];
  const consultantTasks: Task[] = [
    task("c-01", [9, "10:30"], "consultant", "followup", "Follow up — Ashworth & Vale", [16, "12:00"], { done: [16, "09:30"], applicationId: "app-01" }),
    task("c-02", [10, "09:50"], "consultant", "followup", "Follow up — Lumen Retail Group", [18, "12:00"], { done: [18, "10:10"], applicationId: "app-02" }),
    task("c-03", [11, "11:20"], "consultant", "followup", "Follow up — Greystone Health", [24, "12:00"], { done: [24, "09:40"], applicationId: "app-03" }),
    task("c-04", [24, "09:45"], "consultant", "followup", "Second follow-up — Greystone Health", [30, "12:00"], { done: [30, "10:00"], applicationId: "app-03" }),
    task("c-05", [30, "10:05"], "consultant", "followup", "Third follow-up — Greystone Health", [32, "12:00"], { applicationId: "app-03", ...ifPlaced([32, "09:15"]) }),
    task("c-06", [11, "16:05"], "consultant", "followup", "Follow up — Northbridge Consulting", [28, "12:00"], { done: [28, "11:00"], applicationId: "app-04" }),
    task("c-07", [28, "15:05"], "consultant", "custom", "Await stage-2 invite — Northbridge Consulting", [31, "12:00"], { applicationId: "app-04", ...ifPlaced([35, "10:00"]) }),
    task("c-08", [14, "10:05"], "consultant", "followup", "Follow up — Halcyon Digital", [21, "12:00"], { done: [22, "12:30"], applicationId: "app-05" }),
    task("c-09", [31, "12:20"], "consultant", "followup", "Chase feedback — Halcyon Digital", [32, "16:00"], { applicationId: "app-05", ...ifPlaced([32, "15:30"]) }),
    task("c-10", [15, "14:35"], "consultant", "followup", "Follow up — Fenwick & Hale", [25, "12:00"], { done: [25, "10:30"], applicationId: "app-06" }),
    task("c-11", [25, "10:35"], "consultant", "followup", "Second follow-up — Fenwick & Hale", [32, "12:00"], { done: [32, "09:30"], applicationId: "app-06" }),
    task("c-12", [16, "11:05"], "consultant", "followup", "Follow up — Orbital Energy", [25, "12:00"], { done: [25, "11:00"], applicationId: "app-07" }),
    task("c-13", [25, "11:05"], "consultant", "followup", "Second follow-up — Orbital Energy", [32, "12:00"], { applicationId: "app-07", ...ifPlaced([32, "09:00"]) }),
    task("c-14", [21, "10:15"], "consultant", "followup", "Follow up — Marlow & Finch", [31, "12:00"], { applicationId: "app-08", ...ifPlaced([31, "09:05"]) }),
    task("c-15", [22, "09:35"], "consultant", "followup", "Follow up — Kestrel Logistics", [32, "12:00"], { applicationId: "app-09", ...ifPlaced([32, "09:10"]) }),
    task("c-16", [23, "15:25"], "consultant", "followup", "Follow up — Bramble & Co", [32, "12:00"], { applicationId: "app-10", ...ifPlaced([32, "09:20"]) }),
    task("c-17", [29, "16:10"], "consultant", "custom", "Send thank-you note — Ashworth & Vale", [29, "19:00"], { done: [29, "18:00"], applicationId: "app-01" }),
    task("c-18", [31, "16:35"], "consultant", "custom", "Confirm stage-2 logistics — Ashworth & Vale", [32, "12:00"], { done: [32, "10:00"], applicationId: "app-01" }),
  ];
  const tasks = [...candidateTasks, ...consultantTasks];

  /* Messages — the thread with the consultant. */
  const messages: Message[] = [
    { id: "m-01", from: "consultant", at: at(0, "10:05"), body: "Welcome, Amelia. Your plan for the next eight weeks is in the workspace — this week is about the CV. Three small tasks are waiting for you; none takes more than ten minutes." },
    { id: "m-02", from: "candidate", at: at(0, "17:32"), body: "Thanks Daniel — CV uploaded. The achievements will follow tomorrow." },
    { id: "m-03", from: "consultant", at: at(3, "16:35"), body: "CV v2 is ready for you. The biggest change is the summary: it now says what you did for Hartwell's claims platform rather than listing tools. Comment on anything that does not sound like you." },
    { id: "m-04", from: "candidate", at: at(5, "19:22"), body: "Approved — it reads much better. Slightly nervous about the '30% faster' figure but it is accurate." },
    { id: "m-05", from: "consultant", at: at(23, "16:10"), body: "Ashworth & Vale want to meet you on Tuesday at 14:30 with Rachel Okafor, the new Head of Change. The prep kit is in Interviews — can you make it?", applicationId: "app-01" },
    { id: "m-06", from: "candidate", at: at(23, "18:02"), body: "Yes — confirmed. Thank you!", applicationId: "app-01" },
    { id: "m-07", from: "consultant", at: at(29, "09:30"), body: "Good luck this afternoon. Two things to land: the claims-triage discovery story and a question about the programme roadmap.", applicationId: "app-01" },
    { id: "m-08", from: "candidate", at: at(29, "17:05"), body: "Done. It went well I think — lots on stakeholder management and how I would run the first workshops.", applicationId: "app-01" },
    { id: "m-09", from: "consultant", at: at(29, "17:40"), body: "That is exactly what they were testing. Fill in the two-minute debrief when you can and I will send Aisha a thank-you note tonight.", applicationId: "app-01" },
    { id: "m-10", from: "consultant", at: at(31, "12:15"), body: "Halcyon's recruiter says the panel liked your discovery plan for the case exercise. Feedback expected by Friday.", applicationId: "app-05" },
    { id: "m-11", from: "consultant", at: at(39, "15:40"), body: "Ashworth & Vale have made a verbal offer — £64,000, hybrid two days. Written terms tomorrow. The offer summary and questions to ask are in your actions.", applicationId: "app-01" },
    { id: "m-12", from: "candidate", at: at(41, "20:12"), body: "Reviewed. I would like to accept — start date after my four weeks' notice.", applicationId: "app-01" },
    { id: "m-13", from: "consultant", at: at(46, "12:30"), body: "Congratulations. I have withdrawn the other applications with a thank-you to each, so nothing is left open in your name. The pre-start checklist appears the week before you begin." },
  ];

  /* Weekly reports — drafted from the event log, edited and sent by the consultant every Monday 09:00. */
  const report = (week: number, did: string[], happened: string[], next: string[], numbers: WeeklyReport["numbers"], note?: string): WeeklyReport => ({
    id: `rep-0${week}`, week, weekStartsOn: day((week - 1) * 7), publishedAt: at(week * 7, "09:00"), did, happened, next, numbers, note,
  });
  const reports: WeeklyReport[] = [
    report(1, ["Kick-off call and profile assessment", "CV rebuilt to UK format (v2) — approved by you on Saturday", "Target list started: 14 employers across professional services, health and retail"], ["Nothing sent yet — by design. Week 1 is positioning.", "Three opportunities are waiting for your review"], ["LinkedIn rewrite (Monday)", "First applications as soon as you approve the roles", "Supporting-statement template for Senior BA roles"], { applications: 0, replies: 0, interviews: 0, followups: 0 }),
    report(2, ["LinkedIn headline, About and Experience rewritten and approved", "Four applications sent: Ashworth & Vale, Lumen Retail Group, Greystone Health, Northbridge Consulting", "Supporting-statement template built"], ["Ashworth & Vale confirmed receipt the same day", "Kingsbridge Council declined by you (on-site five days) — noted in your targeting"], ["Three more applications lined up for your approval", "First follow-ups go out from Tuesday"], { applications: 4, replies: 1, interviews: 0, followups: 0 }),
    report(3, ["Three applications sent: Halcyon Digital, Fenwick & Hale, Orbital Energy", "Follow-ups sent to Ashworth & Vale and Lumen"], ["Ashworth & Vale shortlisted you — the hiring manager wants a first conversation", "Halcyon's recruiter viewed your profile"], ["Applications eight to ten", "Second follow-ups where there has been silence for ten days"], { applications: 3, replies: 1, interviews: 0, followups: 2 }, "First employer reply in week 3 is on plan."),
    report(4, ["Three applications sent: Marlow & Finch, Kestrel Logistics, Bramble & Co", "Follow-ups: Greystone Health, Fenwick & Hale, Orbital Energy", "CV v3 drafted for Product Owner roles — waiting for your review"], ["Halcyon Digital shortlisted you after the recruiter screen", "Ashworth & Vale booked a stage-1 interview for Tuesday", "Lumen Retail Group paused the role until the new financial year"], ["Ashworth & Vale interview Tuesday 14:30 — prep kit is ready", "Halcyon Digital interview being scheduled for Thursday", "Two new opportunities for your review on Wednesday"], { applications: 3, replies: 2, interviews: 1, followups: 3 }),
    report(5, ["Interview preparation for both stage-1 interviews", "Thank-you notes sent after each interview", "Follow-ups: Greystone Health (third), Fenwick & Hale (second)"], ["Ashworth & Vale — positive feedback, stage 2 with the Finance Director booked", "Halcyon Digital — panel liked the case exercise; feedback expected", "Fenwick & Hale shortlisted you for a recruiter call", "Northbridge Consulting moved you forward to a stage-2 panel"], ["Ashworth & Vale stage 2 on Tuesday, in person", "Northbridge stage-2 panel on Thursday", "Decide on Wexford Bank and Tidewater Media"], { applications: 0, replies: 3, interviews: 2, followups: 2 }),
    report(6, ["Stage-2 preparation for Ashworth & Vale and Northbridge", "Withdrew nothing yet — kept every live application open until you decide"], ["Ashworth & Vale stage 2 went well — decision expected within the week", "Northbridge panel completed", "Orbital Energy closed after no response to two follow-ups"], ["Offer handling: what to ask, what to compare", "Halcyon feedback chased"], { applications: 0, replies: 1, interviews: 2, followups: 1 }),
    report(7, ["Offer summary prepared with the questions worth asking", "Halcyon Digital feedback obtained"], ["Ashworth & Vale offered: Senior Business Analyst, £64,000, hybrid two days", "Halcyon Digital appointed an internal candidate — strong feedback on your case exercise", "Greystone Health closed after three follow-ups"], ["Your decision on the offer", "Withdrawals sent to the other live applications once you accept"], { applications: 0, replies: 2, interviews: 0, followups: 1 }, "Seven weeks from kick-off to an offer."),
    report(8, ["Offer accepted on your behalf, written terms checked", "Withdrew Northbridge, Fenwick & Hale, Marlow & Finch, Kestrel and Bramble with a thank-you to each", "Notice-period plan agreed"], ["Nothing left open in your name", "Start date confirmed"], ["Pre-start checklist appears the week before you begin", "30-, 60- and 90-day check-ins scheduled"], { applications: 0, replies: 0, interviews: 0, followups: 0 }),
  ];

  /* Events — the append-only activity log. Order does not matter; deriveState sorts. */
  type Links = Partial<Pick<ActivityEvent, "applicationId" | "interviewId" | "documentId" | "taskId" | "opportunityId" | "reportId">>;
  let seq = 0;
  const ev = (d: number, hm: string, type: EventType, actor: Actor, title: string, detail?: string, links: Links = {}): ActivityEvent => ({
    id: `ev-${String(++seq).padStart(3, "0")}`, type, at: at(d, hm), actor, title, detail, ...links,
  });
  const A = (applicationId: string, more: Links = {}) => ({ applicationId, ...more });
  const events: ActivityEvent[] = [
    // Week 1 — profile & positioning
    ev(0, "09:30", "kickoff.completed", "consultant", "Kick-off call completed", "Targets agreed: Senior Business Analyst or Product Owner, hybrid, London and Thames Valley, £60k floor. Eight-week plan shared."),
    ev(0, "09:45", "candidate.onboarded", "candidate", "Workspace set up", "Details confirmed, preferences saved, notifications on (email + WhatsApp)."),
    ev(0, "10:00", "task.assigned", "consultant", "Three onboarding tasks assigned", "Upload CV · confirm preferences · three achievements.", { taskId: "t-01" }),
    ev(0, "17:30", "task.completed", "candidate", "CV uploaded", undefined, { taskId: "t-01" }),
    ev(1, "08:15", "task.completed", "candidate", "Preferences confirmed", undefined, { taskId: "t-02" }),
    ev(1, "11:00", "document.versioned", "consultant", "CV v1 filed", "Baseline copy of your CV as received.", { documentId: "doc-cv" }),
    ev(2, "16:00", "note.added", "consultant", "Profile assessment complete", "Positioning: senior BA with product instincts. Lead with the claims-platform outcomes; de-emphasise the tools list."),
    ev(2, "21:40", "task.completed", "candidate", "Three achievements sent", undefined, { taskId: "t-03" }),
    ev(3, "16:30", "document.versioned", "consultant", "CV v2 ready for your review", "Restructured to UK format: two pages, achievement-led bullets, new summary.", { documentId: "doc-cv", taskId: "t-04" }),
    ev(4, "10:00", "opportunity.added", "consultant", "Three opportunities for your review", "Ashworth & Vale · Lumen Retail Group · Kingsbridge Council.", { opportunityId: "opp-01", taskId: "t-05" }),
    ev(5, "19:20", "document.approved", "candidate", "CV v2 approved", undefined, { documentId: "doc-cv", taskId: "t-04" }),
    ev(6, "12:00", "milestone", "system", "Week 1 complete — profile ready", "CV approved, target list started."),
    // Week 2 — LinkedIn & first applications
    ev(7, "09:00", "report.published", "consultant", "Weekly report — week 1", undefined, { reportId: "rep-01" }),
    ev(7, "10:30", "document.versioned", "consultant", "LinkedIn copy ready for your review", "Headline, About and Experience rewritten to match the CV.", { documentId: "doc-li", taskId: "t-06" }),
    ev(8, "08:45", "opportunity.decided", "candidate", "Two opportunities approved, one declined", "Kingsbridge Council declined: on-site five days a week.", { opportunityId: "opp-03", taskId: "t-05" }),
    ev(8, "09:30", "opportunity.added", "consultant", "Two more opportunities for your review", "Greystone Health · Northbridge Consulting.", { opportunityId: "opp-04" }),
    ev(8, "12:00", "document.versioned", "consultant", "Supporting-statement template built", "Senior Business Analyst — finance and claims systems.", { documentId: "doc-cl" }),
    ev(8, "18:35", "document.approved", "candidate", "LinkedIn copy approved", undefined, { documentId: "doc-li", taskId: "t-06" }),
    ev(9, "07:52", "opportunity.decided", "candidate", "Greystone Health and Northbridge approved", undefined, { opportunityId: "opp-05" }),
    ev(9, "10:20", "application.sent", "consultant", "Applied — Ashworth & Vale, Senior Business Analyst", "Careers portal, CV v2 + finance-systems supporting statement.", A("app-01")),
    ev(9, "15:10", "employer.replied", "employer", "Ashworth & Vale confirmed receipt", "Aisha K. (Talent Partner): application received, reviewing this week.", A("app-01")),
    ev(10, "09:45", "application.sent", "consultant", "Applied — Lumen Retail Group, Product Owner", "LinkedIn Easy Apply with CV v2.", A("app-02")),
    ev(11, "11:15", "application.sent", "consultant", "Applied — Greystone Health, Business Analyst (Digital)", "Via James W. (Greystone recruiter).", A("app-03")),
    ev(11, "16:00", "application.sent", "consultant", "Applied — Northbridge Consulting, Product Manager", "Careers portal; product-positioned supporting statement.", A("app-04")),
    ev(11, "17:30", "opportunity.added", "consultant", "Three opportunities for your review", "Halcyon Digital · Fenwick & Hale · Orbital Energy.", { opportunityId: "opp-06" }),
    ev(11, "17:00", "milestone", "system", "First four applications sent"),
    // Week 3 — build the pipeline
    ev(14, "08:15", "opportunity.decided", "candidate", "Halcyon, Fenwick & Hale and Orbital approved", undefined, { opportunityId: "opp-06" }),
    ev(14, "09:00", "report.published", "consultant", "Weekly report — week 2", undefined, { reportId: "rep-02" }),
    ev(14, "10:00", "application.sent", "consultant", "Applied — Halcyon Digital, Senior Business Analyst", "Via Priya S. (Halcyon Talent Acquisition).", A("app-05")),
    ev(15, "14:30", "application.sent", "consultant", "Applied — Fenwick & Hale, Business Analyst (Payments)", "Via Tom B.; on-site role flagged in your notes.", A("app-06")),
    ev(16, "09:30", "followup.sent", "consultant", "Follow-up sent — Ashworth & Vale", "Polite nudge to Aisha K. with availability for a call.", A("app-01", { taskId: "c-01" })),
    ev(16, "11:00", "application.sent", "consultant", "Applied — Orbital Energy, Product Owner", "Job board application with the Product Owner statement.", A("app-07")),
    ev(17, "11:40", "employer.replied", "employer", "Ashworth & Vale replied", "Rachel Okafor (Head of Change) would like a first conversation.", A("app-01")),
    ev(17, "11:45", "stage.changed", "consultant", "Ashworth & Vale → Shortlisted", undefined, A("app-01")),
    ev(17, "11:50", "milestone", "system", "First shortlist", "Ashworth & Vale, eight days after applying."),
    ev(18, "14:20", "application.viewed", "employer", "Halcyon Digital viewed your profile", "Priya S. viewed your LinkedIn profile.", A("app-05")),
    ev(18, "10:10", "followup.sent", "consultant", "Follow-up sent — Lumen Retail Group", undefined, A("app-02", { taskId: "c-02" })),
    ev(18, "16:30", "opportunity.added", "consultant", "Three opportunities for your review", "Marlow & Finch · Kestrel Logistics · Bramble & Co.", { opportunityId: "opp-09" }),
    ev(20, "20:15", "opportunity.decided", "candidate", "Marlow & Finch, Kestrel and Bramble approved", undefined, { opportunityId: "opp-11" }),
    // Week 4 — momentum
    ev(21, "09:00", "report.published", "consultant", "Weekly report — week 3", undefined, { reportId: "rep-03" }),
    ev(21, "09:05", "document.versioned", "consultant", "Supporting statement — Product Owner variant", undefined, { documentId: "doc-cl" }),
    ev(21, "10:10", "application.sent", "consultant", "Applied — Marlow & Finch, Product Owner", "LinkedIn with the Product Owner statement.", A("app-08")),
    ev(22, "09:30", "application.sent", "consultant", "Applied — Kestrel Logistics, Senior Business Analyst", "Careers portal.", A("app-09")),
    ev(22, "12:30", "employer.replied", "employer", "Halcyon Digital replied", "Recruiter screen passed — Priya S. is arranging a panel.", A("app-05")),
    ev(22, "12:35", "stage.changed", "consultant", "Halcyon Digital → Shortlisted", undefined, A("app-05")),
    ev(23, "15:20", "application.sent", "consultant", "Applied — Bramble & Co, Business Analyst", "Job board.", A("app-10")),
    ev(23, "16:05", "interview.scheduled", "consultant", "Interview booked — Ashworth & Vale, stage 1", "Tuesday 14:30, video, with Rachel Okafor and Aisha K. Prep kit added.", A("app-01", { interviewId: "int-01", taskId: "t-07" })),
    ev(23, "16:10", "milestone", "system", "First interview booked", "Ashworth & Vale, stage 1."),
    ev(23, "18:02", "task.completed", "candidate", "Interview confirmed — Ashworth & Vale", undefined, A("app-01", { taskId: "t-07" })),
    ev(24, "09:40", "followup.sent", "consultant", "Follow-up sent — Greystone Health", "To James W.", A("app-03", { taskId: "c-03" })),
    ev(25, "10:30", "followup.sent", "consultant", "Follow-up sent — Fenwick & Hale", undefined, A("app-06", { taskId: "c-10" })),
    ev(25, "14:10", "employer.replied", "employer", "Lumen Retail Group replied", "Role on hold until the new financial year.", A("app-02")),
    ev(25, "14:15", "stage.changed", "consultant", "Lumen Retail Group → Closed (role paused)", "We will re-approach when it reopens.", A("app-02")),
    ev(25, "11:00", "followup.sent", "consultant", "Follow-up sent — Orbital Energy", undefined, A("app-07", { taskId: "c-12" })),
    ev(25, "17:00", "document.versioned", "consultant", "CV v3 ready for your review", "Tailored for Product Owner roles.", { documentId: "doc-cv", taskId: "t-09" }),
    ev(27, "18:00", "milestone", "system", "Ten applications live"),
    // Week 5 — interviews (the default demo week)
    ev(28, "09:00", "report.published", "consultant", "Weekly report — week 4", undefined, { reportId: "rep-04" }),
    ev(28, "09:00", "interview.scheduled", "consultant", "Interview booked — Halcyon Digital, stage 1 panel", "Thursday 10:00, video, with Marcus Bell and Priya S. Prep kit added.", A("app-05", { interviewId: "int-02", taskId: "t-10" })),
    ev(28, "11:00", "followup.sent", "consultant", "Follow-up sent — Northbridge Consulting", undefined, A("app-04", { taskId: "c-06" })),
    ev(28, "12:40", "task.completed", "candidate", "Interview confirmed — Halcyon Digital", undefined, A("app-05", { taskId: "t-10" })),
    ev(28, "15:00", "employer.replied", "employer", "Northbridge Consulting replied", "The hiring manager would like to progress you to a stage-2 panel.", A("app-04")),
    ev(28, "15:05", "stage.changed", "consultant", "Northbridge Consulting → Shortlisted", undefined, A("app-04")),
    ev(28, "21:00", "task.completed", "candidate", "Prep done — Ashworth & Vale stage 1", undefined, A("app-01", { taskId: "t-08" })),
    ev(29, "16:05", "interview.completed", "system", "Interview completed — Ashworth & Vale, stage 1", "Two-minute debrief requested.", A("app-01", { interviewId: "int-01", taskId: "t-12" })),
    ev(29, "18:00", "followup.sent", "consultant", "Thank-you note sent — Ashworth & Vale", "To Aisha K., copying Rachel Okafor.", A("app-01", { taskId: "c-17" })),
    ev(30, "09:00", "opportunity.added", "consultant", "Two opportunities for your review", "Wexford Bank · Tidewater Media.", { opportunityId: "opp-12", taskId: "t-13" }),
    ev(30, "10:00", "followup.sent", "consultant", "Second follow-up sent — Greystone Health", "To James W.; asked for a decision timeline.", A("app-03", { taskId: "c-04" })),
    // Later in week 5 (visible only in the after-placement scenario)
    ev(31, "10:00", "interview.completed", "system", "Interview completed — Halcyon Digital, stage 1", undefined, A("app-05", { interviewId: "int-02" })),
    ev(31, "16:00", "interview.feedback", "employer", "Feedback — Ashworth & Vale", "Positive: Rachel would like you to meet the Finance Director.", A("app-01", { interviewId: "int-01" })),
    ev(31, "16:30", "interview.scheduled", "consultant", "Interview booked — Ashworth & Vale, stage 2", "Tuesday 11:00, in person at Cheapside, with Simon Hartley and Rachel Okafor.", A("app-01", { interviewId: "int-03", taskId: "t-14" })),
    ev(32, "09:30", "employer.replied", "employer", "Fenwick & Hale replied", "Tom B. would like a recruiter call.", A("app-06")),
    ev(32, "09:35", "stage.changed", "consultant", "Fenwick & Hale → Shortlisted", undefined, A("app-06")),
    ev(32, "15:00", "application.viewed", "employer", "Kestrel Logistics viewed your application", undefined, A("app-09")),
    // Weeks 6–8 — second stages, offer, close out
    ev(35, "09:00", "report.published", "consultant", "Weekly report — week 5", undefined, { reportId: "rep-05" }),
    ev(35, "10:00", "stage.changed", "consultant", "Northbridge Consulting → Interview", "Stage-2 panel booked for Thursday.", A("app-04")),
    ev(36, "12:00", "interview.completed", "system", "Interview completed — Ashworth & Vale, stage 2", undefined, A("app-01", { interviewId: "int-03", taskId: "t-15" })),
    ev(39, "15:30", "offer.received", "employer", "Offer — Ashworth & Vale", "Senior Business Analyst, £64,000, hybrid two days. Written terms to follow.", A("app-01")),
    ev(39, "15:35", "milestone", "system", "Offer received", "Seven weeks from kick-off."),
    ev(42, "09:00", "report.published", "consultant", "Weekly report — week 6", undefined, { reportId: "rep-06" }),
    ev(44, "09:00", "stage.changed", "consultant", "Orbital Energy → Closed (no response)", undefined, A("app-07")),
    ev(45, "16:20", "interview.feedback", "employer", "Feedback — Halcyon Digital", "Strong on the case exercise; they appointed an internal candidate.", A("app-05", { interviewId: "int-02" })),
    ev(45, "16:25", "stage.changed", "consultant", "Halcyon Digital → Closed (unsuccessful)", undefined, A("app-05")),
    ev(46, "12:00", "offer.accepted", "candidate", "Offer accepted — Ashworth & Vale", "Start date agreed after four weeks' notice.", A("app-01")),
    ev(46, "12:20", "stage.changed", "consultant", "Five applications withdrawn with thanks", "Northbridge, Fenwick & Hale, Marlow & Finch, Kestrel, Bramble.", A("app-04")),
    ev(46, "12:25", "milestone", "system", "Offer accepted", "Nothing left open in your name."),
    ev(49, "09:00", "report.published", "consultant", "Weekly report — week 7", undefined, { reportId: "rep-07" }),
    ev(50, "10:00", "stage.changed", "consultant", "Greystone Health → Closed (no response)", undefined, A("app-03")),
    ev(56, "09:00", "report.published", "consultant", "Weekly report — week 8", undefined, { reportId: "rep-08" }),
    ev(70, "09:00", "task.assigned", "consultant", "Pre-start checklist and 30-day check-in added", undefined, { taskId: "t-18" }),
  ];

  const snapshot: WorkspaceSnapshot = {
    candidate: {
      id: "cand-amelia", firstName: "Amelia", lastName: "Rowe", email: "amelia.rowe@example.com", phone: "+44 7700 900123",
      location: "Reading, Berkshire", currentTitle: "Business Analyst, Hartwell Insurance", yearsExperience: "5–9 years",
      consultantId: "cons-daniel", status: "active", searchStartedAt: day(0),
      lastSeenAt: at(scenario.lastSeen.day, scenario.lastSeen.time),
      onboarding: { completedSteps: ["details", "documents", "targets", "availability", "notifications"] },
      preferences: {
        targetRoles: ["Senior Business Analyst", "Product Owner"], locations: ["London", "Thames Valley"], workModes: ["Hybrid", "Remote"],
        salaryFloor: 60000, sponsorshipRequired: false, noticePeriod: "4 weeks", approvalMode: "approve-first",
      },
      placement: { applicationId: "app-01", company: "Ashworth & Vale", role: "Senior Business Analyst", acceptedAt: at(46, "12:00"), startsOn: day(77) },
    },
    consultant: {
      id: "cons-daniel", name: "Daniel Mercer", initials: "DM", title: "Career Consultant", replySla: "Replies within 1 business day",
      lastActiveAt: at(scenario.viewedAt.day, "09:05"), email: "daniel.mercer@example.com", whatsappHref: "https://wa.me/447344873257",
    },
    searchPlan, applications, events, tasks, interviews, documents, opportunities, messages, reports,
    notifications: { instant: true, dailyDigest: true, weeklyReport: true, channels: { email: true, whatsapp: true } },
  };

  return { snapshot, viewedAt };
}
