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
// NotificationCenter moved to RightSidebar
import { useLanguage } from '@/lib/i18n';
import {
  LayoutDashboard,
  Palette,
  Image,
  Layers,
  Library,
  FileText,
  User,
  FlaskConical,
  PenTool,
  Edit3,
  Video,
  Box,
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
  const { t } = useLanguage();
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

  // Main navigation items with translations
  const mainNavItems = [
    { icon: LayoutDashboard, label: t.nav.home, href: '/dashboard' },
    { icon: Palette, label: t.nav.studio, href: '/studio' },
    { icon: Edit3, label: 'Editor', href: '/editor' },
    { icon: Box, label: '3D View', href: '/3d-view' },
    { icon: Video, label: 'Motion+', href: '/motion-plus' },
    { icon: Layers, label: t.nav.batch, href: '/batch' },
    {
      icon: Image,
      label: t.nav.gallery,
      href: '/gallery',
      badge: galleryCount > 0
        ? { variant: 'count' as const, count: galleryCount }
        : undefined,
    },
    { icon: Library, label: t.nav.library, href: '/library' },
    { icon: FlaskConical, label: 'Brand Lab', href: '/brand-lab' },
    { icon: PenTool, label: 'Design Office', href: '/design-office' },
    { icon: FileText, label: 'Catalogue', href: '/catalogue' },
    { icon: User, label: t.nav.profile, href: '/profile' },
  ];

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-[100] w-[260px] border-r border-white/10 bg-[var(--panel)] shadow-[var(--shadow-lg)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-panel ease-panel ${leftOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Sidebar Content */}
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Logo */}
        <SidebarLogo />

        {/* Divider */}
        <div className="my-2 h-px bg-[var(--border)]" />

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
