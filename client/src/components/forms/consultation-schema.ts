import { z } from "zod";

export const CV_UPLOAD_MODE: "file" | "link" = import.meta.env.VITE_CV_UPLOAD_MODE === "link" ? "link" : "file";

export const MAX_CV_BYTES = 2 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,.doc,.docx";
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const EXPERIENCE_OPTIONS = ["0–1 years", "2–4 years", "5–9 years", "10–14 years", "15+ years"] as const;

export const INDUSTRY_OPTIONS = [
  "Technology & Software",
  "Finance & Banking",
  "Healthcare & Life Sciences",
  "Engineering & Manufacturing",
  "Marketing & Communications",
  "Sales & Business Development",
  "Human Resources",
  "Education",
  "Consulting & Professional Services",
  "Retail & Hospitality",
  "Public Sector & Not-for-profit",
  "Other",
] as const;

export const TIME_OPTIONS = [
  "Weekday morning (9am–12pm UK)",
  "Weekday afternoon (12pm–5pm UK)",
  "Weekday evening (5pm–8pm UK)",
  "Weekend (flexible)",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https?:\/\/\S+$/i.test(v) || /^(www\.)?linkedin\.com\/\S+$/i.test(v), {
    message: "Enter a full link, e.g. https://linkedin.com/in/your-name",
  });

export const consultationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a WhatsApp or phone number with country code"),
  location: z.string().trim().min(2, "Where are you currently based?"),
  jobTitle: z.string().trim().min(2, "Enter your current or most recent job title"),
  experience: z.enum(EXPERIENCE_OPTIONS, { errorMap: () => ({ message: "Select your years of experience" }) }),
  targetRole: z.string().trim().min(2, "What role are you targeting in the UK?"),
  industry: z.enum(INDUSTRY_OPTIONS, { errorMap: () => ({ message: "Select your preferred industry" }) }),
  linkedin: optionalUrl,
  cvLink: optionalUrl,
  cv: z
    .custom<FileList | undefined>()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_CV_BYTES, "Your CV must be 2 MB or smaller")
    .refine(
      (files) => !files || files.length === 0 || CV_TYPES.includes(files[0].type) || /\.(pdf|docx?)$/i.test(files[0].name),
      "Upload a PDF or Word document",
    ),
  preferredTime: z.enum(TIME_OPTIONS, { errorMap: () => ({ message: "Choose a consultation time" }) }),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you are happy for us to contact you" }) }),
  // Honeypot — must stay empty.
  companyWebsite: z.string().max(0).optional(),
});

export type ConsultationValues = z.infer<typeof consultationSchema>;
