import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Problem } from "@/components/sections/Problem";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DashboardShowcase } from "@/components/sections/DashboardShowcase";
import { WhyVisLuck } from "@/components/sections/WhyVisLuck";
import { Differentiator } from "@/components/sections/Differentiator";
import { Audiences } from "@/components/sections/Audiences";
import { Transparency } from "@/components/sections/Transparency";
import { Testimonials } from "@/components/sections/Testimonials";
import { Metrics } from "@/components/sections/Metrics";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { SEO_PAGES } from "@/constants/seo";

export default function Home() {
  return (
    <>
      <SEO {...SEO_PAGES.home} path="/" />
      <Hero />
      <TrustBar />
      <Problem />
      <AboutTeaser />
      <ServicesGrid variant="compact" tone="paper" />
      <HowItWorks variant="compact" tone="mist" />
      <DashboardShowcase tone="paper" />
      <WhyVisLuck tone="mist" />
      <Differentiator tone="paper" />
      <Audiences tone="mist" />
      <Transparency tone="paper" />
      <Testimonials tone="mist" />
      <Metrics tone="mist" />
      <FaqSection limit={5} tone="mist" />
      <FinalCta />
    </>
  );
}

