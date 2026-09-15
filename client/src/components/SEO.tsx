import { Helmet } from 'react-helmet-async';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants/navigation';
import {
  OPERATIONAL_PARTNER_ADDRESS,
  OPERATIONAL_PARTNER_DISCLOSURE,
  OPERATIONAL_PARTNER_REGISTERED_OFFICE,
  SITE_NAME,
  SITE_URL,
  TRADING_NAME,
} from '@/constants/legal';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
}

const DEFAULT_IMAGE = `${SITE_URL}/visluckLogo.svg`;

export function SEO({ title, description, canonical, image = DEFAULT_IMAGE }: SEOProps) {
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const canonicalUrl = canonical || '';
  const linkedIn = SOCIAL_LINKS.find((link) => link.platform === 'linkedin')?.url;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: TRADING_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    telephone: CONTACT_INFO.phoneHref.replace('tel:', ''),
    email: CONTACT_INFO.email,
    image: imageUrl,
    description: `${description} ${OPERATIONAL_PARTNER_DISCLOSURE} Registered office: ${OPERATIONAL_PARTNER_REGISTERED_OFFICE}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: OPERATIONAL_PARTNER_ADDRESS.streetAddress,
      addressLocality: OPERATIONAL_PARTNER_ADDRESS.addressLocality,
      postalCode: OPERATIONAL_PARTNER_ADDRESS.postalCode,
      addressCountry: OPERATIONAL_PARTNER_ADDRESS.addressCountry,
    },
    areaServed: 'GB',
  };

  if (linkedIn) {
    jsonLd.sameAs = [linkedIn];
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional SEO — public profile is VisLuck, not a personal name */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={TRADING_NAME} />
      <meta name="application-name" content={TRADING_NAME} />
      <link rel="author" href={SITE_URL} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
