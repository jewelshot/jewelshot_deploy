import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | Jewelshot',
  description:
    'Jewelshot API documentation for developers. Integrate AI-powered jewelry image editing into your applications.',
  keywords: [
    'API documentation',
    'developer API',
    'image editing API',
    'jewelry API',
    'AI API',
    'REST API',
    'integration',
  ],
  openGraph: {
    title: 'API Documentation | Jewelshot',
    description:
      'Integrate AI-powered jewelry image editing into your applications.',
    url: '/docs/api',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot API Documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation | Jewelshot',
    description:
      'Integrate AI-powered jewelry image editing into your applications.',
    images: ['/og-image.jpg'],
  },
};

export default function DocsApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

