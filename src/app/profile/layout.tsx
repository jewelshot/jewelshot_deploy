import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Jewelshot',
  description:
    'Manage your Jewelshot profile, subscription, and account settings.',
  robots: {
    index: false, // Private user page
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

