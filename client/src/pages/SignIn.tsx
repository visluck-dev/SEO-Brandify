import { Link } from "wouter";
import { ArrowRight, LockKeyhole, Mail, Play } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { CONTACT_INFO, CTA, ROUTES } from "@/constants/site";

/**
 * /app — the client sign-in page. Sign-in itself arrives with the backend
 * (Phase B); until then the page says so plainly and points to the demo.
 */
export default function SignIn() {
  return (
    <>
      <SEO title="Client sign-in | VisLuck" description="Sign in to your VisLuck candidate workspace." noindex />
      <section className="relative overflow-hidden border-b border-hairline bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 dot-grid" />
        </div>
        <Container className="relative py-14 md:py-20">
          <div className="mx-auto max-w-xl rounded-3xl border border-hairline bg-white p-6 shadow-panel sm:p-10">
            <span className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700" aria-hidden="true">
              <LockKeyhole className="size-5" />
            </span>
            <p className="eyebrow mt-5">Client workspace</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">Sign in</h1>
            <p className="mt-3 text-base leading-relaxed text-body">
              VisLuck clients get a private workspace once their search plan is agreed — we email the sign-in link after the first consultation, so there is no password to remember.
            </p>
            <div className="mt-7 grid gap-3">
              <Button asChild size="lg">
                <Link href={CTA.href}>
                  {CTA.label} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.demo}>
                  <Play aria-hidden="true" /> Try the sample workspace
                </Link>
              </Button>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Already a client and cannot find your link? Email{" "}
                <a href={CONTACT_INFO.emailHref} className="font-medium text-teal-700 underline-offset-4 hover:underline">
                  {CONTACT_INFO.email}
                </a>{" "}
                and we will resend it.
              </span>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
