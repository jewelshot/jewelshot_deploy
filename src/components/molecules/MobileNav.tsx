/**
 * MobileNav Component
 *
 * Bottom navigation bar for mobile devices
 * Provides quick access to Home, Studio, and Gallery
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Image } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
    },
    {
      href: '/studio',
      icon: Sparkles,
      label: 'Studio',
    },
    {
      href: '/gallery',
      icon: Image,
      label: 'Gallery',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2">
      {/* Compact Glassmorphic Container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-xl backdrop-blur-xl">
        {/* Subtle Aurora Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-1/4 -top-1/2 h-20 w-20 animate-pulse rounded-full bg-purple-500/20 blur-2xl" />
          <div
            className="absolute -right-1/4 -top-1/2 h-20 w-20 animate-pulse rounded-full bg-pink-500/20 blur-2xl"
            style={{ animationDelay: '1s' }}
          />
        </div>

        {/* Compact Navigation Items */}
        <div className="relative flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col items-center gap-1 py-1 transition-all duration-200"
              >
                {/* Icon Container - More Compact */}
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-500/40'
                      : 'bg-white/[0.03] group-hover:bg-white/[0.08] group-active:scale-90'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-all duration-200 ${
                      active
                        ? 'text-white'
                        : 'text-white/50 group-hover:text-white/80'
                    }`}
                  />
                </div>

                {/* Compact Label */}
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    active
                      ? 'text-purple-400'
                      : 'text-white/50 group-hover:text-white/80'
                  }`}
                >
                  {item.label}
                </span>

                {/* Minimal Active Indicator */}
                {active && (
                  <div className="absolute -bottom-0.5 h-0.5 w-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MobileNav;
