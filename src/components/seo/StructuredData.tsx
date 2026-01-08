/**
 * Structured Data Components for SEO
 * 
 * JSON-LD structured data for rich search results
 */

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jewelshot',
    alternateName: 'Jewelshot Studio',
    url: 'https://jewelshot.com',
    logo: 'https://jewelshot.com/icon-512.png',
    description: 'AI-powered jewelry photography platform for professionals',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/jewelshot',
      'https://www.instagram.com/jewelshot',
      'https://www.linkedin.com/company/jewelshot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@jewelshot.com',
      availableLanguage: ['English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Software Application Schema
export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Jewelshot Studio',
    operatingSystem: 'Web',
    applicationCategory: 'MultimediaApplication',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available with premium plans',
    },
    featureList: [
      'AI Image Generation',
      'Background Removal',
      'Image Upscaling',
      'Batch Processing',
      '3D Model Viewer',
      'Video Generation',
    ],
    screenshot: 'https://jewelshot.com/og-image.jpg',
    softwareVersion: '1.0',
    author: {
      '@type': 'Organization',
      name: 'Jewelshot',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema with Search
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jewelshot',
    alternateName: 'Jewelshot Studio',
    url: 'https://jewelshot.com',
    description: 'AI-powered jewelry photo editor for professionals',
    publisher: {
      '@type': 'Organization',
      name: 'Jewelshot',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jewelshot.com/icon-512.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Jewelshot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jewelshot is an AI-powered jewelry photography platform that helps photographers, jewelers, and e-commerce sellers create stunning product images using advanced AI technology.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does AI image generation work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI analyzes your product image and generates professional-quality photos with custom backgrounds, lighting, and styling based on your selected presets.',
        },
      },
      {
        '@type': 'Question',
        name: 'What file formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jewelshot supports JPG, PNG, and WebP for images. For 3D models, we support STL format with 3DM support coming soon.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a free plan available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Jewelshot offers a free tier with limited credits. Premium plans are available for higher volume usage and additional features.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Combined Schema Component for Landing Page
export function LandingPageSchemas() {
  return (
    <>
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <WebSiteSchema />
      <FAQSchema />
    </>
  );
}

