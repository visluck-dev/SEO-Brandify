import { Link } from "wouter";

import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/Section";
import { SEO_PAGES } from "@/constants/seo";
import { CTA } from "@/constants/site";

export default function NotFound() {
  return (
    <>
      <SEO {...SEO_PAGES.notFound} noindex />
      <Section className="min-h-[60vh]">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow mb-4">404</p>
          <h1 className="h-section">We couldn’t find that page.</h1>
          <p className="lead mt-5">The link may be out of date. Head back to the homepage or book a free consultation.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild size="lg">
              <Link href={CTA.href}>{CTA.label}</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
