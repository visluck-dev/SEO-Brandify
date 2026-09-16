import emailjs from "@emailjs/browser";

import type { ConsultationValues } from "@/components/forms/consultation-schema";

/**
 * EmailJS configuration. Public keys are safe to ship in the client; override via .env
 * (VITE_EMAILJS_PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID). See EMAILJS_SETUP.md.
 */
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "3xfHeZB919CMBJudZ",
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_rlionil",
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_nevx0zw",
};

export function isEmailJSConfigured(): boolean {
  return Object.values(EMAILJS_CONFIG).every((v) => v && !v.startsWith("YOUR_"));
}

/** Human-readable summary so the existing `{{message}}` template shows every field unchanged. */
export function formatConsultationMessage(v: ConsultationValues): string {
  const lines = [
    "New free-consultation request from visluck.com",
    "",
    `Full name: ${v.fullName}`,
    `Email: ${v.email}`,
    `WhatsApp / phone: ${v.phone}`,
    `Current location: ${v.location}`,
    `Current job title: ${v.jobTitle}`,
    `Years of experience: ${v.experience}`,
    `Target UK role: ${v.targetRole}`,
    `Preferred industry: ${v.industry}`,
    `LinkedIn: ${v.linkedin ?? "Not provided"}`,
    `CV: ${v.cv?.length ? `Attached (${v.cv[0].name})` : v.cvLink ?? "Not provided"}`,
    `Preferred consultation time: ${v.preferredTime}`,
    `Consent to contact: yes`,
  ];
  return lines.join("\n");
}

/**
 * Sends the consultation form. Uses sendForm so a CV file input can be attached
 * (attachments require an EmailJS paid plan and the template's "Form File Attachment"
 * setting pointing at the `cv` field). Named inputs in the form become template params.
 */
export async function sendConsultationRequest(form: HTMLFormElement): Promise<void> {
  if (!isEmailJSConfigured()) {
    throw new Error("EmailJS is not configured. Set VITE_EMAILJS_* in .env (see EMAILJS_SETUP.md).");
  }
  const response = await emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form, {
    publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
  });
  if (response.status !== 200) {
    throw new Error(`EmailJS returned status ${response.status}`);
  }
}
