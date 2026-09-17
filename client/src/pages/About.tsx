import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Audiences } from "@/components/sections/Audiences";
import { Transparency } from "@/components/sections/Transparency";
import { FinalCta } from "@/components/sections/FinalCta";
import { OperationalPartnerDisclosure } from "@/components/OperationalPartnerDisclosure";
import { EXPERIENCE } from "@/constants/home";
import { SEO_PAGES } from "@/constants/seo";
import { ROUTES } from "@/constants/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export default function About() {
  return (
    <>
      <SEO {...SEO_PAGES.about} path={ROUTES.about} jsonLd={[breadcrumbJsonLd([{ name: "About Us", path: ROUTES.about }])]} />
      <PageIntro
        eyebrow="About VisLuck"
        title="More Than Career Advice. A Structured Job Search Experience."
        lead="VisLuck was created to make the UK job-search process more organised, transparent and candidate-focused."
      />
      <AboutTeaser variant="full" showHeader={false} />

      <Section tone="paper" id="experience" aria-labelledby="experience-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">{EXPERIENCE.eyebrow}</p>
            <h2 id="experience-title" className="h-section">
              {EXPERIENCE.title}
            </h2>
            <p className="lead mt-6">{EXPERIENCE.body}</p>
          </div>
          <div className="rounded-3xl border border-hairline bg-mist p-7 md:p-10">
            <p className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{EXPERIENCE.stat}</p>
            <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{EXPERIENCE.intro}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {EXPERIENCE.areas.map((a) => (
                <li key={a} className="rounded-xl border border-hairline bg-white px-4 py-3 font-display text-sm font-semibold text-ink">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Audiences tone="mist" />
      <Transparency tone="paper" />

      <Section tone="mist" aria-label="Operational partner">
        <OperationalPartnerDisclosure className="mx-auto max-w-3xl" />
      </Section>

      <FinalCta />
    </>
  );
}
