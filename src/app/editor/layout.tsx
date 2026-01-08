import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editor | Jewelshot - Advanced Image Editing',
  description:
    'Professional image editor with AI-powered tools. Inpainting, background removal, upscaling, and advanced adjustments for perfect jewelry photos.',
  keywords: [
    'image editor',
    'photo editor',
    'inpainting',
    'background removal',
    'AI upscale',
    'jewelry editing',
    'professional photo editing',
  ],
  openGraph: {
    title: 'Editor | Jewelshot',
    description:
      'Professional image editor with AI-powered inpainting, background removal, and upscaling.',
    url: '/editor',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editor | Jewelshot',
    description:
      'Professional image editor with AI-powered inpainting, background removal, and upscaling.',
    images: ['/og-image.jpg'],
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

