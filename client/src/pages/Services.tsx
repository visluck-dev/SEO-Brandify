import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/layout/PageIntro";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Transparency } from "@/components/sections/Transparency";
import { FinalCta } from "@/components/sections/FinalCta";
import { SEO_PAGES } from "@/constants/seo";
import { ROUTES } from "@/constants/site";
import { breadcrumbJsonLd, servicesJsonLd } from "@/lib/jsonld";

export default function Services() {
  return (
    <>
      <SEO
        {...SEO_PAGES.services}
        path={ROUTES.services}
        jsonLd={[breadcrumbJsonLd([{ name: "Services", path: ROUTES.services }]), servicesJsonLd]}
      />
      <PageIntro
        eyebrow="Services"
        title="Everything You Need for a More Structured UK Job Search"
        lead="Six connected services — from a UK-ready CV to ongoing support after you click Apply — delivered as one structured journey rather than a list of links."
        withCta
      />
      <ServicesGrid variant="full" tone="mist" showHeader={false} />
      <HowItWorks variant="compact" tone="paper" />
      <Transparency tone="mist" />
      <FinalCta />
    </>
  );
}
