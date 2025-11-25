import { Metadata } from 'next';
import { Sidebar } from '@/components/organisms/Sidebar';

export const metadata: Metadata = {
  title: 'Preset Library | Jewelshot - Customize Your Quick Presets',
  description:
    'Browse and select your favorite AI presets. Customize your Quick Presets panel with presets from various categories.',
  keywords: [
    'preset library',
    'ai presets',
    'quick presets',
    'image presets',
    'style presets',
    'jewelshot library',
  ],
  openGraph: {
    title: 'Preset Library | Jewelshot',
    description:
      'Browse and select your favorite AI presets. Customize your Quick Presets panel.',
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
      'Browse and select your favorite AI presets. Customize your Quick Presets panel.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: false, // Private user library, don't index
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
