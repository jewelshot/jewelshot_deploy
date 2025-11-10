/**
 * Premium Button Component
 * Native app-inspired button with smooth animations
 */

'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { premiumTheme } from '@/styles/mobile-premium';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function PremiumButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: PremiumButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: premiumTheme.colors.gradient.primary,
          color: premiumTheme.colors.text.primary,
          boxShadow: premiumTheme.shadow.glow,
        };
      case 'secondary':
        return {
          background: premiumTheme.colors.bg.tertiary,
          border: `1px solid ${premiumTheme.colors.border.default}`,
          color: premiumTheme.colors.text.primary,
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: premiumTheme.colors.text.secondary,
        };
      case 'danger':
        return {
          background: premiumTheme.colors.gradient.accent,
          color: premiumTheme.colors.text.primary,
          boxShadow: '0 0 20px rgba(245, 87, 108, 0.4)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${premiumTheme.spacing.sm} ${premiumTheme.spacing.md}`,
          fontSize: premiumTheme.typography.fontSize.sm,
          minHeight: '36px',
        };
      case 'md':
        return {
          padding: `${premiumTheme.spacing.md} ${premiumTheme.spacing.lg}`,
          fontSize: premiumTheme.typography.fontSize.base,
          minHeight: '48px',
        };
      case 'lg':
        return {
          padding: `${premiumTheme.spacing.lg} ${premiumTheme.spacing.xl}`,
          fontSize: premiumTheme.typography.fontSize.lg,
          minHeight: '56px',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={className}
      style={{
        ...variantStyles,
        ...sizeStyles,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: premiumTheme.radius.lg,
        fontWeight: premiumTheme.typography.fontWeight.semibold,
        fontFamily: premiumTheme.typography.fontFamily.primary,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.5 : 1,
        transition: `all ${premiumTheme.animation.duration.normal} ${premiumTheme.animation.easing.smooth}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: premiumTheme.spacing.sm,
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        border: variantStyles.border || 'none',
        outline: 'none',
        ...props.style,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.96)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.96)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isLoading ? (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <>
          {icon && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {icon}
            </span>
          )}
          {children}
        </>
      )}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
}
