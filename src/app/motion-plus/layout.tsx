import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Motion+ | Jewelshot - Video Generation',
  description:
    'Create stunning jewelry videos from images. AI-powered video generation with turntable animations, speed control, and professional editing tools.',
  keywords: [
    'video generation',
    'AI video',
    'jewelry video',
    'turntable video',
    'product video',
    'image to video',
    'jewelry animation',
  ],
  openGraph: {
    title: 'Motion+ | Jewelshot',
    description:
      'Create stunning jewelry videos from images with AI-powered video generation.',
    url: '/motion-plus',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Motion+',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motion+ | Jewelshot',
    description:
      'Create stunning jewelry videos from images with AI-powered video generation.',
    images: ['/og-image.jpg'],
  },
};

export default function MotionPlusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

