import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | Jewelshot - Your AI-Edited Images',
  description:
    'View and manage your AI-edited images. Browse, search, filter, and download your image collection with ease.',
  keywords: [
    'image gallery',
    'photo gallery',
    'AI edited images',
    'image collection',
    'photo management',
    'jewelshot gallery',
  ],
  openGraph: {
    title: 'Gallery | Jewelshot',
    description:
      'View and manage your AI-edited images. Browse, search, and download your collection.',
    url: '/gallery',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery | Jewelshot',
    description:
      'View and manage your AI-edited images. Browse, search, and download your collection.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: false, // Private user gallery, don't index
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
