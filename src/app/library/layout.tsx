import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preset Library | Jewelshot - AI Prompts',
  description:
    'Browse and apply professional jewelry photography presets. Curated AI prompts for rings, necklaces, earrings, and bracelets in various styles.',
  keywords: [
    'jewelry presets',
    'AI prompts',
    'photography presets',
    'jewelry styles',
    'prompt library',
    'jewelry photography',
    'professional presets',
  ],
  openGraph: {
    title: 'Preset Library | Jewelshot',
    description:
      'Professional jewelry photography presets and AI prompts for stunning product images.',
    url: '/library',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Preset Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preset Library | Jewelshot',
    description:
      'Professional jewelry photography presets and AI prompts for stunning product images.',
    images: ['/og-image.jpg'],
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

