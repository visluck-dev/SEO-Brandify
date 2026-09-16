import { SEO } from "@/components/SEO";
import { FaqSection, faqJsonLd } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { SEO_PAGES } from "@/constants/seo";
import { ROUTES } from "@/constants/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export default function Faqs() {
  return (
    <>
      <SEO {...SEO_PAGES.faqs} path={ROUTES.faqs} jsonLd={[breadcrumbJsonLd([{ name: "FAQs", path: ROUTES.faqs }]), faqJsonLd]} />
      <FaqSection tone="paper" titleAs="h1" lead="Straight answers about what VisLuck does — and does not — do for your UK job search." />
      <FinalCta />
    </>
  );
}
