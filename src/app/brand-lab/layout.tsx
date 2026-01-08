import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Lab | Jewelshot - Style Creator',
  description:
    'Create and manage your unique jewelry photography styles. Upload reference images to define custom styles and presets for consistent branding.',
  keywords: [
    'brand style',
    'style creator',
    'photography style',
    'jewelry branding',
    'custom presets',
    'visual identity',
    'brand consistency',
  ],
  openGraph: {
    title: 'Brand Lab | Jewelshot',
    description:
      'Create and manage your unique jewelry photography styles for consistent branding.',
    url: '/brand-lab',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Brand Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Lab | Jewelshot',
    description:
      'Create and manage your unique jewelry photography styles for consistent branding.',
    images: ['/og-image.jpg'],
  },
};

export default function BrandLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

