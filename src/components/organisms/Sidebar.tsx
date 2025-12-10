/**
 * Sidebar Component
 *
 * Main sidebar with premium glassmorphism effect.
 * Features smooth slide animations, sections, and full navigation menu.
 * Matches mock design exactly.
 *
 * @example
 * ```tsx
 * <Sidebar />
 * ```
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import SidebarLogo from '@/components/molecules/SidebarLogo';
import NavigationItem from '@/components/molecules/NavigationItem';
import UserProfile from '@/components/molecules/UserProfile';
import {
  LayoutDashboard,
  Palette,
  Image,
  Layers,
  Library,
  FileText,
  User,
} from 'lucide-react';

// Tools section (Coming Soon - All tools are integrated in Studio)
const toolsItems: never[] = [
  // Removed: Tools are now in Studio page
  // Future: Separate tool pages can be added here
];

// Settings section (Coming Soon)
const settingsItems: never[] = [
  // Removed: Settings pages not yet implemented
  // Future: Add preferences and billing pages
];

export function Sidebar() {
  const { leftOpen } = useSidebarStore();
  const pathname = usePathname();
  const [galleryCount, setGalleryCount] = useState(0);

  // Update gallery count
  useEffect(() => {
    const updateCount = () => {
      if (typeof window !== 'undefined') {
        import('@/lib/gallery-storage').then(
          async ({ getGalleryImageCount }) => {
            const count = await getGalleryImageCount();
            setGalleryCount(count);
          }
        );
      }
    };

    updateCount();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jewelshot_gallery_images') {
        updateCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event when saving from current tab
    const handleGallerySave = () => updateCount();
    window.addEventListener('gallery-updated', handleGallerySave);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gallery-updated', handleGallerySave);
    };
  }, []);

  // Main navigation items
  const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Palette, label: 'Studio', href: '/studio' },
    { icon: Layers, label: 'Batch', href: '/batch' },
    {
      icon: Image,
      label: 'Gallery',
      href: '/gallery',
      badge: galleryCount > 0
        ? { variant: 'count' as const, count: galleryCount }
        : undefined,
    },
    { icon: Library, label: 'Presets', href: '/library' },
    { icon: FileText, label: 'Catalogue', href: '/catalogue' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-[100] w-[240px] border-r border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl transition-transform duration-500 ease-in-out ${leftOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Sidebar Content */}
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Logo */}
        <SidebarLogo />

        {/* Divider */}
        <div className="my-4 h-px bg-white/[0.06]" />

        {/* Main Navigation */}
        <nav className="mb-2 flex flex-col gap-1">
          {mainNavItems.map((item, index) => (
            <NavigationItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              badge={item.badge}
              animationDelay={100 + index * 50}
            />
          ))}
        </nav>

        {/* Tools Section - Removed (integrated in Studio) */}
        {/* Settings Section - Removed (not yet implemented) */}

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Profile */}
        <UserProfile />
      </div>
    </aside>
  );
}

export default Sidebar;
