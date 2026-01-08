import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Batch Processing | Jewelshot - Bulk Image Editing',
  description:
    'Process multiple jewelry images at once. Batch apply AI enhancements, background removal, and style presets for efficient product photography.',
  keywords: [
    'batch processing',
    'bulk image editing',
    'multiple images',
    'batch enhancement',
    'product photography',
    'bulk photo editor',
    'batch AI editing',
  ],
  openGraph: {
    title: 'Batch Processing | Jewelshot',
    description:
      'Process multiple jewelry images at once with AI-powered batch editing.',
    url: '/batch',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Batch Processing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Batch Processing | Jewelshot',
    description:
      'Process multiple jewelry images at once with AI-powered batch editing.',
    images: ['/og-image.jpg'],
  },
};

export default function BatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


