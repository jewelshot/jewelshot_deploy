import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Office | Jewelshot - Collection Generator',
  description:
    'Generate jewelry collection variations from a single product. Create matching set pieces, material variations, and convert sketches to realistic images.',
  keywords: [
    'jewelry collection',
    'product variations',
    'set pieces',
    'jewelry design',
    'sketch to image',
    'material variations',
    'collection generator',
  ],
  openGraph: {
    title: 'Design Office | Jewelshot',
    description:
      'Generate jewelry collection variations from a single product with AI.',
    url: '/design-office',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Design Office',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Office | Jewelshot',
    description:
      'Generate jewelry collection variations from a single product with AI.',
    images: ['/og-image.jpg'],
  },
};

export default function DesignOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

