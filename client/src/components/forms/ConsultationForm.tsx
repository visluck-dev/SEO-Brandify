import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { CircleAlert, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CONTACT_INFO, ROUTES } from "@/constants/site";
import { formatConsultationMessage, sendConsultationRequest } from "@/lib/emailjs";
import { SelectField, TextField } from "./ConsultationFields";
import { ConsultationSuccess } from "./ConsultationSuccess";
import {
  CV_ACCEPT,
  CV_UPLOAD_MODE,
  EXPERIENCE_OPTIONS,
  INDUSTRY_OPTIONS,
  TIME_OPTIONS,
  consultationSchema,
  type ConsultationValues,
} from "./consultation-schema";

const MIN_FILL_MS = 3000;

export function ConsultationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const form = useForm<ConsultationValues>({
    resolver: zodResolver(consultationSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", phone: "", location: "", jobTitle: "", targetRole: "", linkedin: "", cvLink: "", companyWebsite: "" },
  });

  const values = form.watch();

  // Warn before leaving the page with unsent, edited fields.
  useEffect(() => {
    if (!form.formState.isDirty || status === "success") return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [form.formState.isDirty, status]);

  async function onSubmit(v: ConsultationValues) {
    // Honeypot filled or submitted implausibly fast: pretend success, send nothing.
    if (v.companyWebsite || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      await sendConsultationRequest(formRef.current!);
      setStatus("success");
      window.scrollTo({ top: 0 });
    } catch (error) {
      console.error("Consultation request failed:", error);
      setStatus("error");
    }
  }

  if (status === "success") return <ConsultationSuccess />;

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative rounded-3xl border border-hairline bg-white p-6 shadow-card sm:p-8 md:p-10">
        {/* Mirrors for the existing EmailJS template ({{name}}, {{message}}, {{reply_to}}). */}
        <input type="hidden" name="name" value={values.fullName ?? ""} readOnly />
        <input type="hidden" name="reply_to" value={values.email ?? ""} readOnly />
        <textarea name="message" value={formatConsultationMessage(values)} readOnly hidden aria-hidden="true" tabIndex={-1} />
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            Company website
            <input type="text" tabIndex={-1} autoComplete="off" {...form.register("companyWebsite")} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField control={form.control} name="fullName" label="Full name" placeholder="Your full name" autoComplete="name" />
          <TextField control={form.control} name="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
          <TextField control={form.control} name="phone" label="WhatsApp / phone" type="tel" placeholder="+44 7…" autoComplete="tel" hint="Include your country code." />
          <TextField control={form.control} name="location" label="Current location" placeholder="City, country" autoComplete="address-level2" />
          <TextField control={form.control} name="jobTitle" label="Current job title" placeholder="e.g. Business Analyst" autoComplete="organization-title" />
          <SelectField control={form.control} name="experience" label="Years of experience" placeholder="Select a range" options={EXPERIENCE_OPTIONS} />
          <TextField control={form.control} name="targetRole" label="Target UK role" placeholder="e.g. Senior Product Manager" autoComplete="off" />
          <SelectField control={form.control} name="industry" label="Preferred industry" placeholder="Select an industry" options={INDUSTRY_OPTIONS} />
          <TextField control={form.control} name="linkedin" label="LinkedIn profile" type="url" placeholder="https://linkedin.com/in/your-name" optional className="sm:col-span-2" />

          {CV_UPLOAD_MODE === "file" ? (
            <FormField
              control={form.control}
              name="cv"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="font-display text-sm font-semibold text-ink">
                    Upload CV <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Upload className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input type="file" accept={CV_ACCEPT} name={name} ref={ref} onBlur={onBlur} onChange={(e) => onChange(e.target.files)} className="pr-10" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">PDF or Word, up to 2 MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <TextField control={form.control} name="cvLink" label="Link to your CV" type="url" placeholder="Google Drive, Dropbox or OneDrive link" autoComplete="off" optional className="sm:col-span-2" />
          )}

          <SelectField control={form.control} name="preferredTime" label="Preferred consultation time" placeholder="Choose a time window" options={TIME_OPTIONS} className="sm:col-span-2" />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox name={field.name} checked={field.value === true} onCheckedChange={(c) => field.onChange(c === true)} className="mt-0.5" />
                  </FormControl>
                  <FormLabel className="text-sm font-normal leading-relaxed text-body">
                    I agree to VisLuck contacting me about my consultation. See our{" "}
                    <Link href={ROUTES.privacy} className="font-semibold text-teal-700 underline underline-offset-4">
                      Privacy Policy
                    </Link>
                    .
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              Something went wrong sending your request. Please try again or email{" "}
              <a href={CONTACT_INFO.emailHref} className="font-semibold underline underline-offset-4">
                {CONTACT_INFO.email}
              </a>
              .
            </span>
          </p>
        )}

        <Button type="submit" size="xl" className="mt-8 w-full" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Book My Free Consultation"}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">No obligation — a conversation about your career goals.</p>
      </form>
    </Form>
  );
}
