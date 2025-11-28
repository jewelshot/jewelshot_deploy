/**
 * Skip Link Component
 * 
 * Allows keyboard users to skip repetitive navigation
 * WCAG 2.4.1 - Bypass Blocks
 */

'use client';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

export default SkipLink;


