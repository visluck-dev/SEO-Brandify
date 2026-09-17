import { CONTACT_INFO } from "./site";
import { OPERATIONAL_PARTNER_LEGAL_NAME, OPERATIONAL_PARTNER_REGISTERED_OFFICE } from "./legal";

export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalDoc = { title: string; intro: string; updated: string; sections: LegalSection[] };

/** Shown above every legal page until the text has been approved. Set to "" to remove. */
export const LEGAL_DRAFT_NOTICE =
  "Draft for legal review — this text was prepared as a starting point and has not yet been reviewed by a solicitor.";

export const PRIVACY_POLICY: LegalDoc = {
  title: "Privacy Policy",
  intro: "This policy explains what personal data VisLuck collects through visluck.com, why we collect it, and the choices you have.",
  updated: "September 2026",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `VisLuck is a trading name used for UK job-search and career support services. Operational capacity is supplied by ${OPERATIONAL_PARTNER_LEGAL_NAME}, whose registered office is ${OPERATIONAL_PARTNER_REGISTERED_OFFICE}. Questions about this policy can be sent to ${CONTACT_INFO.email}.`,
      ],
    },
    {
      heading: "What we collect",
      bullets: [
        "Details you give us in the consultation form: name, email address, phone or WhatsApp number, location, current job title, years of experience, target role, preferred industry, LinkedIn profile, preferred consultation time and, if you choose to provide it, your CV.",
        "Correspondence you send us by email, phone or WhatsApp.",
        "Basic technical information sent by your browser when you visit the site (for example IP address and browser type). We do not run analytics or advertising cookies.",
      ],
    },
    {
      heading: "Why we use it",
      bullets: [
        "To respond to your consultation request and discuss how we could support your job search (lawful basis: taking steps at your request before entering into a contract).",
        "To deliver services you agree to and keep records of that work (lawful basis: performance of a contract).",
        "To keep the website secure and to comply with legal obligations (lawful basis: legitimate interests and legal obligation).",
      ],
      paragraphs: ["We do not sell personal data and we do not use it for automated decision-making."],
    },
    {
      heading: "Who we share it with",
      bullets: [
        "Our operational partner and team members who help deliver the service.",
        "Service providers that process data on our behalf, including the email delivery provider used by the consultation form.",
        "Employers or recruiters only where you have asked us to support an application and only to the extent needed for that application.",
        "Authorities where we are required to by law.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "Consultation requests are kept for up to 12 months if we do not go on to work together. Records of services we provide are kept for the duration of the service and for up to 6 years afterwards to meet legal and accounting requirements.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Under UK data protection law you can ask to access, correct, delete or restrict the personal data we hold about you, object to our processing, or ask for a copy in a portable format. To exercise any of these rights, email ${CONTACT_INFO.email}. You can also complain to the Information Commissioner’s Office (ico.org.uk).`,
      ],
    },
    {
      heading: "International transfers",
      paragraphs: [
        "Where a service provider stores data outside the UK, we rely on safeguards recognised under UK law, such as adequacy regulations or standard contractual clauses.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: ["We may update this policy from time to time. The date at the top shows when it was last changed."],
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDoc = {
  title: "Terms & Conditions",
  intro: "These terms apply to your use of visluck.com. Services we agree to provide are governed by a separate written agreement.",
  updated: "September 2026",
  sections: [
    {
      heading: "Using this website",
      paragraphs: [
        "You may browse the site and submit a consultation request for your own personal use. You must not misuse the site, attempt to gain unauthorised access to it, or use it to send unlawful, misleading or harmful content.",
      ],
    },
    {
      heading: "No guarantee of outcomes",
      paragraphs: [
        "VisLuck does not guarantee a job, interview or employment offer. Hiring decisions are made by employers. Any support we provide is intended to help you approach the process professionally.",
      ],
    },
    {
      heading: "Consultations and services",
      paragraphs: [
        "A free consultation is a conversation about your profile and goals and does not create an obligation on either side. Any services we then agree to provide, their scope and any fees will be set out in writing before work begins.",
      ],
    },
    {
      heading: "Your information",
      paragraphs: [
        "You are responsible for making sure the information you give us is accurate and that you are entitled to share it. Our Privacy Policy explains how we handle personal data.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The content, design and branding of this website belong to VisLuck or its licensors. You may not copy or reuse them without permission, except for personal, non-commercial viewing.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "We provide this website as is and do not promise that it will always be available or error-free. To the extent permitted by law, we are not liable for loss arising from your use of the site or reliance on its content. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction."],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about these terms: ${CONTACT_INFO.email}.`],
    },
  ],
};
