import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Jewelshot',
  description:
    'Your Jewelshot dashboard. View recent activity, usage statistics, and quick access to all features.',
  robots: {
    index: false, // Private user page
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

