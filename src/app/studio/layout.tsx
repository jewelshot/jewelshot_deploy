import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio | Jewelshot - AI Image Editing',
  description:
    'Professional AI-powered image editing studio. Transform, enhance, and edit your images with cutting-edge artificial intelligence tools.',
  keywords: [
    'image editor',
    'AI image editing',
    'photo editor',
    'online image editor',
    'jewelry photo editor',
    'professional image editing',
    'AI studio',
  ],
  openGraph: {
    title: 'Studio | Jewelshot',
    description:
      'Professional AI-powered image editing studio. Transform and enhance your images.',
    url: '/studio',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio | Jewelshot',
    description:
      'Professional AI-powered image editing studio. Transform and enhance your images.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
