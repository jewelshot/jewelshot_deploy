import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Jewelshot',
  description:
    'Sign in or create an account to start using Jewelshot AI image editing studio.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
