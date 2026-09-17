import { Link } from "wouter";
import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/site";

export function ConsultationSuccess() {
  return (
    <div role="status" aria-live="polite" className="rounded-3xl border border-teal-100 bg-white p-8 shadow-card md:p-12">
      <span className="flex size-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <CircleCheck className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-2xl font-bold text-ink md:text-3xl">Thank you for contacting VisLuck.</h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-body">
        Our team will review your details and get in touch regarding your consultation.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.home}>Back to home</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href={ROUTES.howItWorks}>See how it works</Link>
        </Button>
      </div>
    </div>
  );
}
