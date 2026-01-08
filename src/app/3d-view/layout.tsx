import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D View | Jewelshot - 3D Model Viewer',
  description:
    'Interactive 3D jewelry model viewer. Upload STL files, apply realistic metal and gemstone materials, and capture high-quality snapshots.',
  keywords: [
    '3D viewer',
    'STL viewer',
    '3D jewelry',
    'jewelry rendering',
    '3D model viewer',
    'jewelry visualization',
    'metal materials',
    'gemstone rendering',
  ],
  openGraph: {
    title: '3D View | Jewelshot',
    description:
      'Interactive 3D jewelry model viewer with realistic materials and snapshot export.',
    url: '/3d-view',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot 3D Viewer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D View | Jewelshot',
    description:
      'Interactive 3D jewelry model viewer with realistic materials and snapshot export.',
    images: ['/og-image.jpg'],
  },
};

export default function ThreeDViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

