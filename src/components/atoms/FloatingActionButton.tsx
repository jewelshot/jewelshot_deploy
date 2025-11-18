/**
 * Floating Action Button (FAB)
 * iOS/Material Design inspired floating button
 */

'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { premiumTheme } from '@/styles/mobile-premium';

interface FloatingActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  badge?: string | number;
}

export function FloatingActionButton({
  icon,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  badge,
  className = '',
  ...props
}: FloatingActionButtonProps) {
  const getPositionStyles = () => {
    const offset = premiumTheme.spacing.lg;
    switch (position) {
      case 'bottom-right':
        return { bottom: offset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'top-right':
        return { top: offset, right: offset };
      case 'top-left':
        return { top: offset, left: offset };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: '48px', height: '48px', fontSize: '20px' };
      case 'md':
        return { width: '56px', height: '56px', fontSize: '24px' };
      case 'lg':
        return { width: '64px', height: '64px', fontSize: '28px' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: premiumTheme.colors.gradient.primary,
          boxShadow: `${premiumTheme.shadow.lg}, ${premiumTheme.shadow.glow}`,
        };
      case 'secondary':
        return {
          background: premiumTheme.colors.bg.glass,
          backdropFilter: premiumTheme.blur.md,
          border: `1px solid ${premiumTheme.colors.border.glass}`,
          boxShadow: premiumTheme.shadow.md,
        };
    }
  };

  const positionStyles = getPositionStyles();
  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <button
      {...props}
      className={className}
      style={{
        ...positionStyles,
        ...sizeStyles,
        ...variantStyles,
        position: 'fixed',
        borderRadius: premiumTheme.radius.full,
        border: variantStyles.border || 'none',
        color: premiumTheme.colors.text.primary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: premiumTheme.zIndex.sticky,
        transition: `all ${premiumTheme.animation.duration.normal} ${premiumTheme.animation.easing.smooth}`,
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        outline: 'none',
        ...props.style,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.9)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.9)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: premiumTheme.colors.gradient.accent,
            color: premiumTheme.colors.text.primary,
            fontSize: '10px',
            fontWeight: premiumTheme.typography.fontWeight.bold,
            minWidth: '20px',
            height: '20px',
            borderRadius: premiumTheme.radius.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            boxShadow: premiumTheme.shadow.sm,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
