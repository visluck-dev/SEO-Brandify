export const TAGLINE = "Your UK Job Search, Managed.";
export const BRAND_LINE = "Where vision beats luck";

export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  howItWorks: "/how-it-works",
  why: "/why-visluck",
  faqs: "/faqs",
  book: "/book-a-consultation",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  cookies: "/cookie-policy",
  disclaimer: "/disclaimer",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "About Us", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "How It Works", href: ROUTES.howItWorks },
  { label: "Why VisLuck", href: ROUTES.why },
  { label: "FAQs", href: ROUTES.faqs },
  { label: "Contact", href: ROUTES.book },
] as const;

export const CTA = {
  label: "Book a Free Consultation",
  href: ROUTES.book,
} as const;

export const CONTACT_INFO = {
  email: "hr@visluck.com",
  emailHref: "mailto:hr@visluck.com",
  phone: "+44 7344 873257",
  phoneHref: "tel:+447344873257",
  whatsappHref: "https://wa.me/447344873257",
} as const;

export const SOCIAL_LINKS = [
  { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/company/visluck" },
  { platform: "instagram", label: "Instagram", url: "#" },
  { platform: "facebook", label: "Facebook", url: "#" },
] as const;

export const FOOTER_LINKS = {
  quick: [
    { label: "Home", href: ROUTES.home },
    { label: "About", href: ROUTES.about },
    { label: "Services", href: ROUTES.services },
    { label: "How It Works", href: ROUTES.howItWorks },
    { label: "Why VisLuck", href: ROUTES.why },
    { label: "FAQs", href: ROUTES.faqs },
    { label: "Contact", href: ROUTES.book },
  ],
  legal: [
    { label: "Privacy Policy", href: ROUTES.privacy },
    { label: "Terms & Conditions", href: ROUTES.terms },
    { label: "Cookie Policy", href: ROUTES.cookies },
    { label: "Disclaimer", href: ROUTES.disclaimer },
  ],
} as const;

export const FOOTER_BLURB =
  "Professional UK job-search and career support for candidates looking to navigate the UK employment market with greater structure and confidence.";
