import { Helmet } from "react-helmet-async";

import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants/site";
import {
  OPERATIONAL_PARTNER_ADDRESS,
  OPERATIONAL_PARTNER_LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
  TRADING_NAME,
} from "@/constants/legal";

interface SEOProps {
  title: string;
  description: string;
  /** Route path, used to build the canonical URL (omit for noindex pages). */
  path?: string;
  image?: string;
  noindex?: boolean;
  /** Extra JSON-LD objects (FAQPage, BreadcrumbList, Service...) appended after Organization. */
  jsonLd?: Record<string, unknown>[];
}

const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: TRADING_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  image: DEFAULT_IMAGE,
  email: CONTACT_INFO.email,
  telephone: CONTACT_INFO.phoneHref.replace("tel:", ""),
  areaServed: "GB",
  description:
    "Personalised UK job-search support: CV optimisation, LinkedIn positioning, targeted opportunities, application support, interview preparation and progress tracking.",
  address: {
    "@type": "PostalAddress",
    streetAddress: OPERATIONAL_PARTNER_ADDRESS.streetAddress,
    addressLocality: OPERATIONAL_PARTNER_ADDRESS.addressLocality,
    postalCode: OPERATIONAL_PARTNER_ADDRESS.postalCode,
    addressCountry: OPERATIONAL_PARTNER_ADDRESS.addressCountry,
  },
  parentOrganization: { "@type": "Organization", name: OPERATIONAL_PARTNER_LEGAL_NAME },
  sameAs: SOCIAL_LINKS.filter((s) => s.url.startsWith("http")).map((s) => s.url),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-GB",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function SEO({ title, description, path, image = DEFAULT_IMAGE, noindex = false, jsonLd = [] }: SEOProps) {
  const canonical = path ? `${SITE_URL}${path === "/" ? "/" : path}` : undefined;

  return (
    <Helmet>
      <html lang="en-GB" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {!noindex && <script type="application/ld+json">{JSON.stringify(organizationLd)}</script>}
      {!noindex && <script type="application/ld+json">{JSON.stringify(websiteLd)}</script>}
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", ...obj })}
        </script>
      ))}
    </Helmet>
  );
}
