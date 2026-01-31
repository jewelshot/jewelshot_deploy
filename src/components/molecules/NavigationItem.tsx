/**
import React from 'react';

 * NavigationItem Component (Molecule)
 *
 * A single navigation item for the sidebar menu.
 * Orchestrates NavIcon, NavLabel, ActiveIndicator, Badge, and NavShortcut atoms.
 * Features hover effects, active state, badges, and keyboard shortcuts.
 *
 * @example
 * ```tsx
 * <NavigationItem
 *   icon={Home}
 *   label="Home"
 *   href="/home"
 *   active={false}
 *   badge={{ variant: 'new' }}
 *   shortcut="⌘H"
 * />
 * ```
 */

'use client';

import Link from 'next/link';
import Badge from '@/components/atoms/Badge';
import NavIcon from '@/components/atoms/NavIcon';
import NavLabel from '@/components/atoms/NavLabel';
import NavShortcut from '@/components/atoms/NavShortcut';

interface BadgeConfig {
  variant: 'new' | 'pro' | 'count' | 'dot';
  count?: number;
  color?: 'green' | 'blue' | 'red' | 'orange';
}

interface NavigationItemProps {
  /**
   * Icon to display (Lucide icon component)
   */
  icon: React.ComponentType<{ className?: string }>;

  /**
   * Text label for the nav item
   */
  label: string;

  /**
   * Navigation href
   */
  href: string;

  /**
   * Whether this item is currently active
   * @default false
   */
  active?: boolean;

  /**
   * Badge configuration
   */
  badge?: BadgeConfig;

  /**
   * Keyboard shortcut display
   */
  shortcut?: string;

  /**
   * Animation delay for stagger effect (in ms)
   * @default 0
   */
  animationDelay?: number;
}

export function NavigationItem({
  icon: Icon,
  label,
  href,
  active = false,
  badge,
  shortcut,
  animationDelay = 0,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={`group relative flex animate-[fadeInSlide_400ms_ease-out_forwards] items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium opacity-0 transition-colors duration-200 ${
        active
          ? 'text-white/80'
          : 'text-white/40 hover:text-white/60'
      }`}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* Active indicator - thin line at bottom */}
      {active && (
        <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}

      {/* Icon */}
      <NavIcon icon={Icon} active={active} />

      {/* Label */}
      <NavLabel>{label}</NavLabel>

      {/* Badge */}
      {badge && (
        <Badge
          variant={badge.variant}
          count={badge.count}
          color={badge.color}
        />
      )}

      {/* Keyboard Shortcut */}
      {shortcut && <NavShortcut shortcut={shortcut} />}
    </Link>
  );
}

export default NavigationItem;
