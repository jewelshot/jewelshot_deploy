import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogue | Jewelshot - Export & Organize',
  description:
    'Organize and export your jewelry product catalogue. Create professional lookbooks, export in multiple formats, and manage your product inventory.',
  keywords: [
    'product catalogue',
    'jewelry catalogue',
    'export images',
    'lookbook',
    'product inventory',
    'catalogue export',
    'jewelry inventory',
  ],
  openGraph: {
    title: 'Catalogue | Jewelshot',
    description:
      'Organize and export your jewelry product catalogue in professional formats.',
    url: '/catalogue',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Catalogue',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalogue | Jewelshot',
    description:
      'Organize and export your jewelry product catalogue in professional formats.',
    images: ['/og-image.jpg'],
  },
};

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

