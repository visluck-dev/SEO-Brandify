export type PageSeo = { title: string; description: string };

export const SEO_PAGES = {
  home: {
    title: "Your UK Job Search, Managed | VisLuck",
    description:
      "Personalised UK job-search support: CV optimisation, LinkedIn positioning, targeted opportunities, application support, interview preparation and a dashboard that tracks it all.",
  },
  about: {
    title: "About VisLuck | Structured UK Job-Search Support",
    description:
      "VisLuck combines recruitment experience, career support and technology to make the UK job-search process more organised, transparent and candidate-focused.",
  },
  services: {
    title: "Services | CV, LinkedIn, Applications & Interview Prep | VisLuck",
    description:
      "CV optimisation, LinkedIn optimisation, job-search strategy, application support, interview preparation and ongoing career support for the UK market.",
  },
  howItWorks: {
    title: "How It Works | From Career Goals to a Structured Journey | VisLuck",
    description:
      "Seven clear steps: consultation, profile assessment, strategy, profile optimisation, strategic applications, tracking and interview preparation.",
  },
  why: {
    title: "Why VisLuck | Recruitment Expertise, Transparent Process",
    description:
      "Recruitment expertise, a personalised strategy, UK focus, a transparent process, a candidate dashboard and human support at every stage.",
  },
  faqs: {
    title: "FAQs | UK Job-Search Support Questions Answered | VisLuck",
    description:
      "Answers on guarantees, applying on your behalf, CV rewrites, LinkedIn, interview preparation, application tracking and how to get started.",
  },
  book: {
    title: "Book a Free Consultation | VisLuck",
    description:
      "Tell us about your profile and UK career goals. Our team will get in touch to discuss how VisLuck can support your job search.",
  },
  privacy: { title: "Privacy Policy | VisLuck", description: "How VisLuck collects, uses and protects your personal data." },
  terms: { title: "Terms & Conditions | VisLuck", description: "The terms that apply to the VisLuck website and services." },
  cookies: { title: "Cookie Policy | VisLuck", description: "How the VisLuck website uses cookies and similar technologies." },
  disclaimer: { title: "Disclaimer | VisLuck", description: "VisLuck does not guarantee jobs, interviews or offers. Hiring decisions remain with employers." },
  notFound: { title: "Page not found | VisLuck", description: "The page you were looking for does not exist." },
} as const satisfies Record<string, PageSeo>;
