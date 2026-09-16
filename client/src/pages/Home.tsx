import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { SEO_PAGES } from "@/constants/seo";

export default function Home() {
  return (
    <>
      <SEO {...SEO_PAGES.home} path="/" />
      <Hero />
      <TrustBar />
    </>
  );
}
