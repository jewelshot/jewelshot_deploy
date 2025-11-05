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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                active
                  ? 'scale-110 text-purple-400'
                  : 'text-white/50 hover:text-white/80 active:scale-95'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
