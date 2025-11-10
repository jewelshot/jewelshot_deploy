/**
 * Premium Bottom Navigation
 * iOS/Android inspired bottom tab bar
 */

'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Sparkles, Image as ImageIcon, User, Zap } from 'lucide-react';
import { premiumTheme, glassStyle } from '@/styles/mobile-premium';
import { CreditCounter } from '@/components/molecules/CreditCounter';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string | number;
}

export function PremiumBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems: NavItem[] = [
    {
      icon: <Home size={24} />,
      label: 'Home',
      path: '/',
    },
    {
      icon: <Sparkles size={24} />,
      label: 'Create',
      path: '/studio',
    },
    {
      icon: <ImageIcon size={24} />,
      label: 'Gallery',
      path: '/gallery',
    },
    {
      icon: <User size={24} />,
      label: 'Profile',
      path: '/profile',
    },
  ];

  const handleNavClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    router.push(item.path);
  };

  const isActive = (path: string, index: number) => {
    return pathname === path || activeIndex === index;
  };

  return (
    <>
      {/* Safe area spacer for iOS */}
      <div style={{ height: 'calc(64px + env(safe-area-inset-bottom))' }} />

      {/* Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          ...glassStyle,
          borderTop: `1px solid ${premiumTheme.colors.border.glass}`,
          borderTopLeftRadius: premiumTheme.radius.xl,
          borderTopRightRadius: premiumTheme.radius.xl,
          zIndex: premiumTheme.zIndex.sticky,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Credit Counter - Top Center */}
        <div
          style={{
            position: 'absolute',
            top: `-${premiumTheme.spacing.lg}`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: premiumTheme.colors.gradient.primary,
              borderRadius: premiumTheme.radius.full,
              padding: `${premiumTheme.spacing.sm} ${premiumTheme.spacing.lg}`,
              boxShadow: `${premiumTheme.shadow.lg}, ${premiumTheme.shadow.glow}`,
              display: 'flex',
              alignItems: 'center',
              gap: premiumTheme.spacing.sm,
            }}
          >
            <Zap size={16} fill="currentColor" />
            <CreditCounter />
          </div>
        </div>

        {/* Nav Items */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${navItems.length}, 1fr)`,
            padding: `${premiumTheme.spacing.md} ${premiumTheme.spacing.sm}`,
            gap: premiumTheme.spacing.sm,
          }}
        >
          {navItems.map((item, index) => {
            const active = isActive(item.path, index);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item, index)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: premiumTheme.spacing.xs,
                  padding: `${premiumTheme.spacing.sm} ${premiumTheme.spacing.xs}`,
                  background: active
                    ? premiumTheme.colors.bg.tertiary
                    : 'transparent',
                  borderRadius: premiumTheme.radius.lg,
                  border: 'none',
                  cursor: 'pointer',
                  transition: `all ${premiumTheme.animation.duration.normal} ${premiumTheme.animation.easing.smooth}`,
                  color: active
                    ? premiumTheme.colors.text.primary
                    : premiumTheme.colors.text.secondary,
                  position: 'relative',
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                  {item.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-8px',
                        background: premiumTheme.colors.status.error,
                        color: premiumTheme.colors.text.primary,
                        fontSize: '10px',
                        fontWeight: premiumTheme.typography.fontWeight.bold,
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: premiumTheme.radius.full,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: premiumTheme.typography.fontSize.xs,
                    fontWeight: active
                      ? premiumTheme.typography.fontWeight.semibold
                      : premiumTheme.typography.fontWeight.normal,
                    fontFamily: premiumTheme.typography.fontFamily.primary,
                  }}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      width: '32px',
                      height: '3px',
                      background: premiumTheme.colors.gradient.primary,
                      borderRadius: premiumTheme.radius.full,
                      boxShadow: premiumTheme.shadow.glow,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
