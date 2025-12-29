import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
}

const DEFAULT_IMAGE = '/visluckLogo.svg';
const SITE_NAME = 'VisLuck HR Consultancy';

export function SEO({ title, description, canonical, image = DEFAULT_IMAGE }: SEOProps) {
  const imageUrl = image.startsWith('http') ? image : image;
  const canonicalUrl = canonical || '';

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
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={SITE_NAME} />
    </Helmet>
  );
}
