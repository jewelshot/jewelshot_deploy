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
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphic Container with Gradient Border */}
      <div className="relative m-2 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-white/[0.08] via-white/[0.05] to-white/[0.08] shadow-2xl backdrop-blur-2xl">
        {/* Aurora Glow Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 -top-1/2 h-32 w-32 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
          <div
            className="absolute -right-1/4 -top-1/2 h-32 w-32 animate-pulse rounded-full bg-pink-500/30 blur-3xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Navigation Items */}
        <div className="relative flex items-center justify-around px-6 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col items-center gap-2 transition-all duration-300"
              >
                {/* Active Background Glow */}
                {active && (
                  <div className="absolute -inset-3 animate-pulse rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl"></div>
                )}

                {/* Icon Container */}
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 group-hover:bg-white/10 group-active:scale-90'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 transition-all duration-300 ${
                      active
                        ? 'text-white'
                        : 'text-white/60 group-hover:text-white/90'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'
                      : 'text-white/60 group-hover:text-white/90'
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div className="absolute -bottom-1 h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-lg shadow-purple-500/50"></div>
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
