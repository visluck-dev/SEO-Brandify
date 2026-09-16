import { SEO } from "@/components/SEO";
import { Section, SectionHeader } from "@/components/layout/Section";

/** Temporary stand-in used while pages are built out (removed before launch). */
export default function Placeholder({ title }: { title: string }) {
  return (
    <>
      <SEO title={`${title} | VisLuck`} description={title} noindex />
      <Section className="min-h-[50vh]">
        <SectionHeader eyebrow="Coming next" title={title} titleAs="h1" />
      </Section>
    </>
  );
}
