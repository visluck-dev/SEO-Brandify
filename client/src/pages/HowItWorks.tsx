import { SEO } from "@/components/SEO";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DashboardShowcase } from "@/components/sections/DashboardShowcase";
import { Differentiator } from "@/components/sections/Differentiator";
import { FinalCta } from "@/components/sections/FinalCta";
import { SEO_PAGES } from "@/constants/seo";
import { ROUTES } from "@/constants/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export default function HowItWorksPage() {
  return (
    <>
      <SEO {...SEO_PAGES.howItWorks} path={ROUTES.howItWorks} jsonLd={[breadcrumbJsonLd([{ name: "How It Works", path: ROUTES.howItWorks }])]} />
      <HowItWorks variant="full" tone="paper" titleAs="h1" />
      <DashboardShowcase tone="mist" />
      <Differentiator tone="paper" />
      <FinalCta />
    </>
  );
}
