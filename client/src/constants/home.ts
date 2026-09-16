export const HERO = {
  eyebrow: "UK job-search support",
  title: "Your UK Job Search, Managed.",
  subtitle: "Stop searching alone. Start searching strategically.",
  description:
    "VisLuck provides personalised UK job-search support — from CV optimisation and LinkedIn positioning to targeted opportunities, application support, interview preparation and progress tracking.",
  tagline: "Your career goals. Our recruitment expertise. One structured journey.",
  proof: ["UK-Focused Support", "Personalised Approach", "Transparent Process"],
} as const;

export const TRUST_BAR = {
  title: "Recruitment Expertise. Personalised Support. Technology-Enabled.",
  items: [
    { value: "15+ Years", label: "Combined Recruitment & HR Experience" },
    { value: "UK-Focused", label: "Career & Job Search Support" },
    { value: "End-to-End", label: "Candidate Support" },
  ],
} as const;

export const PROBLEM = {
  title: "Applying to Jobs Shouldn't Feel Like a Full-Time Job",
  sequence: ["You find a vacancy.", "You update your CV.", "You apply.", "Then… silence."],
  body: "You lose track of where you applied, which CV you used, when you should follow up and what you should do next.",
  resolution: "VisLuck brings structure to the entire process.",
  intro: "We help you move from:",
  shifts: [
    { from: "Random Applications", to: "Structured Job Search" },
    { from: "Generic CV", to: "Targeted Profile" },
    { from: "Untracked Applications", to: "Complete Visibility" },
    { from: "Searching Alone", to: "Professional Support" },
  ],
} as const;

export const ABOUT = {
  eyebrow: "About VisLuck",
  title: "More Than Career Advice. A Structured Job Search Experience.",
  paragraphs: [
    "VisLuck was created to make the UK job-search process more organised, transparent and candidate-focused.",
    "Our approach combines recruitment experience, career support and technology to help candidates navigate the UK employment market with greater clarity.",
    "We don't believe in sending candidates endless job links and leaving them to figure out the rest.",
    "We believe in understanding the candidate, identifying relevant opportunities, supporting the application process and keeping the entire journey organised.",
  ],
  philosophyIntro: "Our philosophy is simple:",
  philosophy: "The candidate should always know what is happening with their job search.",
} as const;

export const EXPERIENCE = {
  eyebrow: "Experience",
  title: "Built on Recruitment & HR Expertise",
  body: "VisLuck combines recruitment knowledge with technology to create a more organised candidate experience.",
  stat: "15+ Years of Combined Experience",
  intro: "Our team brings experience across:",
  areas: [
    "Talent Acquisition",
    "Recruitment",
    "HR Management",
    "Candidate Management",
    "Career Support",
    "Interview Preparation",
  ],
} as const;

export const DIFFERENTIATOR = {
  title: "We Don't Just Tell You Where to Look.",
  subtitle: "We help you manage the journey.",
  traditional: {
    label: "Traditional Approach",
    steps: ["Find jobs", "Send CV", "Wait", "Repeat"],
  },
  visluck: {
    label: "VisLuck Approach",
    steps: ["Understand", "Strategise", "Optimise", "Match", "Apply", "Track", "Prepare", "Follow Up"],
  },
  closing: "Your UK job search, managed from one place.",
} as const;
