import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FAQS, FAQ_SECTION } from "@/constants/faqs";
import { ROUTES } from "@/constants/site";

interface FaqSectionProps {
  /** Number of questions to show (home shows a subset and links to /faqs). */
  limit?: number;
  tone?: "paper" | "mist";
  lead?: string;
}

export function FaqSection({ limit, tone = "paper", lead }: FaqSectionProps) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <Section tone={tone} id="faqs" aria-labelledby="faq-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow={FAQ_SECTION.eyebrow} title={FAQ_SECTION.title} lead={lead} titleId="faq-title" />
          {limit && (
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href={ROUTES.faqs}>
                All questions <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
        <Reveal>
          <Accordion type="single" collapsible className="divide-y divide-hairline rounded-2xl border border-hairline bg-white px-5 shadow-card sm:px-7">
            {items.map((f, i) => (
              <AccordionItem key={f.question} value={`faq-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left font-display text-base font-bold text-ink hover:no-underline hover:text-teal-700 md:text-lg [&>svg]:size-5 [&>svg]:text-teal-600">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-body">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

/** schema.org FAQPage payload for the SEO component. */
export const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};
