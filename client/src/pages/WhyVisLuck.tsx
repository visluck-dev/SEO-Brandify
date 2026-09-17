import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/layout/PageIntro";
import { WhyVisLuck } from "@/components/sections/WhyVisLuck";
import { TrustBar } from "@/components/sections/TrustBar";
import { Differentiator } from "@/components/sections/Differentiator";
import { Transparency } from "@/components/sections/Transparency";
import { FinalCta } from "@/components/sections/FinalCta";
import { SEO_PAGES } from "@/constants/seo";
import { ROUTES } from "@/constants/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export default function WhyVisLuckPage() {
  return (
    <>
      <SEO {...SEO_PAGES.why} path={ROUTES.why} jsonLd={[breadcrumbJsonLd([{ name: "Why VisLuck", path: ROUTES.why }])]} />
      <PageIntro
        eyebrow="Why VisLuck"
        title="Why Choose VisLuck?"
        lead="Recruitment expertise, a personalised strategy and a transparent, technology-enabled process — with people supporting you at every stage."
        withCta
      />
      <TrustBar />
      <WhyVisLuck tone="paper" />
      <Differentiator tone="mist" />
      <Transparency tone="paper" />
      <FinalCta />
    </>
  );
}
