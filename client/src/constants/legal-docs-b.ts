import { CONTACT_INFO } from "./site";
import type { LegalDoc } from "./legal-docs-a";

export const COOKIE_POLICY: LegalDoc = {
  title: "Cookie Policy",
  intro: "This page explains which cookies and similar technologies visluck.com uses.",
  updated: "September 2026",
  sections: [
    {
      heading: "What we use today",
      paragraphs: [
        "visluck.com does not currently set analytics, advertising or tracking cookies. The site is a static website and does not require cookies to display its pages.",
      ],
    },
    {
      heading: "Strictly necessary technologies",
      paragraphs: [
        "When you submit the consultation form, your browser connects to our email delivery provider to send your request. That provider may set technical cookies or use local storage needed to complete the request. These are used only to send your message.",
      ],
    },
    {
      heading: "If this changes",
      paragraphs: [
        "If we introduce analytics or other non-essential cookies in future, we will update this page and ask for your consent before setting them.",
      ],
    },
    {
      heading: "Managing cookies",
      paragraphs: [
        "You can block or delete cookies through your browser settings. Blocking strictly necessary technologies may stop the consultation form from sending.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about cookies: ${CONTACT_INFO.email}.`],
    },
  ],
};

export const DISCLAIMER: LegalDoc = {
  title: "Disclaimer",
  intro: "No false promises. Just a better process.",
  updated: "September 2026",
  sections: [
    {
      heading: "No guarantee of employment",
      paragraphs: [
        "We do not guarantee a job, interview or employment offer. Hiring decisions ultimately remain with employers.",
      ],
    },
    {
      heading: "What we do provide",
      bullets: [
        "Professional profile support",
        "Relevant opportunity research",
        "Structured application support",
        "Application tracking",
        "Interview preparation",
        "Ongoing guidance",
        "Transparent communication",
      ],
      paragraphs: [
        "Our goal is not to promise an outcome we cannot control. Our goal is to help you approach the process professionally.",
      ],
    },
    {
      heading: "Illustrative content",
      paragraphs: [
        "Dashboard screens and examples shown on this website use sample data to illustrate how the service can present information. They are not records of real candidates or employers.",
      ],
    },
    {
      heading: "Not professional advice",
      paragraphs: [
        "Information on this website is general guidance about the UK job-search process. It is not legal, immigration, financial or tax advice. If you need advice on your right to work or visa position, please consult a suitably qualified adviser.",
      ],
    },
    {
      heading: "Third-party links",
      paragraphs: [
        "Links to external websites are provided for convenience. We are not responsible for their content or their handling of your data.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about this disclaimer: ${CONTACT_INFO.email}.`],
    },
  ],
};
