export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  points: readonly string[];
  icon: "FileText" | "Linkedin" | "Compass" | "Send" | "MessagesSquare" | "LifeBuoy";
  featured?: boolean;
};

export const SERVICES_SECTION = {
  eyebrow: "Services",
  title: "Everything You Need for a More Structured UK Job Search",
} as const;

export const SERVICES: readonly Service[] = [
  {
    id: "cv-optimisation",
    number: "01",
    title: "CV Optimisation",
    description:
      "Create a professional CV aligned with UK-market expectations and your target career direction.",
    points: ["UK-format CV", "CV restructuring", "Professional positioning", "Achievement-focused content", "ATS-conscious formatting"],
    icon: "FileText",
    featured: true,
  },
  {
    id: "linkedin-optimisation",
    number: "02",
    title: "LinkedIn Optimisation",
    description:
      "Build a stronger professional presence that communicates your experience clearly to recruiters and employers.",
    points: ["Headline optimisation", "About section", "Experience positioning", "Skills optimisation", "Profile structure"],
    icon: "Linkedin",
  },
  {
    id: "job-search-strategy",
    number: "03",
    title: "Job Search Strategy",
    description:
      "Identify the types of roles and opportunities that align with your experience and career goals.",
    points: ["Target role identification", "Industry mapping", "Opportunity research", "Job-market guidance", "Search strategy"],
    icon: "Compass",
  },
  {
    id: "application-support",
    number: "04",
    title: "Application Support",
    description: "Take a more targeted approach to relevant opportunities.",
    points: ["Job description review", "CV tailoring", "Supporting statement / cover letter support", "Application preparation", "Application tracking"],
    icon: "Send",
    featured: true,
  },
  {
    id: "interview-preparation",
    number: "05",
    title: "Interview Preparation",
    description: "Prepare with greater confidence before speaking to employers.",
    points: ["Interview preparation", "Mock interviews", "Role research", "Company research", "Question preparation", "Feedback & improvement"],
    icon: "MessagesSquare",
  },
  {
    id: "ongoing-career-support",
    number: "06",
    title: "Ongoing Career Support",
    description: "Your job search doesn’t end after clicking Apply. Receive structured support throughout your journey.",
    points: ["Progress reviews", "Application updates", "Follow-up tracking", "Career guidance", "Dedicated support"],
    icon: "LifeBuoy",
  },
];
