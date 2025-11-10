/**
 * Premium Loader Component
 * Animated loading states for premium feel
 */

'use client';

import React from 'react';
import { premiumTheme } from '@/styles/mobile-premium';

type LoaderVariant = 'spinner' | 'pulse' | 'shimmer' | 'progress';

interface PremiumLoaderProps {
  variant?: LoaderVariant;
  size?: 'sm' | 'md' | 'lg';
  progress?: number; // 0-100 for progress variant
  text?: string;
}

export function PremiumLoader({
  variant = 'spinner',
  size = 'md',
  progress = 0,
  text,
}: PremiumLoaderProps) {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return '24px';
      case 'md':
        return '40px';
      case 'lg':
        return '64px';
    }
  };

  const loaderSize = getSize();

  if (variant === 'spinner') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: premiumTheme.spacing.md,
        }}
      >
        <div
          style={{
            width: loaderSize,
            height: loaderSize,
            borderRadius: premiumTheme.radius.full,
            border: '3px solid rgba(102, 126, 234, 0.2)',
            borderTopColor: premiumTheme.colors.accent.primary,
            animation: 'spin 0.8s linear infinite',
          }}
        />
        {text && (
          <p
            style={{
              fontSize: premiumTheme.typography.fontSize.sm,
              color: premiumTheme.colors.text.secondary,
              margin: 0,
            }}
          >
            {text}
          </p>
        )}
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: premiumTheme.spacing.md,
        }}
      >
        <div
          style={{
            width: loaderSize,
            height: loaderSize,
            borderRadius: premiumTheme.radius.full,
            background: premiumTheme.colors.gradient.primary,
            animation: 'pulse 1.5s ease-in-out infinite',
            boxShadow: premiumTheme.shadow.glowStrong,
          }}
        />
        {text && (
          <p
            style={{
              fontSize: premiumTheme.typography.fontSize.sm,
              color: premiumTheme.colors.text.secondary,
              margin: 0,
            }}
          >
            {text}
          </p>
        )}
        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(0.9);
            }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'shimmer') {
    return (
      <div
        style={{
          width: '100%',
          height: loaderSize,
          borderRadius: premiumTheme.radius.lg,
          background: `linear-gradient(
            90deg,
            ${premiumTheme.colors.bg.tertiary} 0%,
            ${premiumTheme.colors.bg.secondary} 50%,
            ${premiumTheme.colors.bg.tertiary} 100%
          )`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }}
      >
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: premiumTheme.spacing.sm,
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: premiumTheme.radius.full,
            background: premiumTheme.colors.bg.tertiary,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              background: premiumTheme.colors.gradient.primary,
              borderRadius: premiumTheme.radius.full,
              transition: `width ${premiumTheme.animation.duration.normal} ${premiumTheme.animation.easing.smooth}`,
              boxShadow: premiumTheme.shadow.glow,
            }}
          />
        </div>
        {text && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                fontSize: premiumTheme.typography.fontSize.sm,
                color: premiumTheme.colors.text.secondary,
                margin: 0,
              }}
            >
              {text}
            </p>
            <p
              style={{
                fontSize: premiumTheme.typography.fontSize.sm,
                fontWeight: premiumTheme.typography.fontWeight.semibold,
                color: premiumTheme.colors.text.primary,
                margin: 0,
              }}
            >
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Skeleton Screen Component
export function SkeletonScreen() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: premiumTheme.spacing.lg,
        padding: premiumTheme.spacing.lg,
      }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            borderRadius: premiumTheme.radius.lg,
            background: premiumTheme.colors.bg.tertiary,
            padding: premiumTheme.spacing.lg,
          }}
        >
          <div
            style={{
              width: '60%',
              height: '20px',
              borderRadius: premiumTheme.radius.sm,
              background: `linear-gradient(
                90deg,
                ${premiumTheme.colors.bg.secondary} 0%,
                rgba(255, 255, 255, 0.05) 50%,
                ${premiumTheme.colors.bg.secondary} 100%
              )`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
              marginBottom: premiumTheme.spacing.md,
            }}
          />
          <div
            style={{
              width: '100%',
              height: '120px',
              borderRadius: premiumTheme.radius.md,
              background: `linear-gradient(
                90deg,
                ${premiumTheme.colors.bg.secondary} 0%,
                rgba(255, 255, 255, 0.05) 50%,
                ${premiumTheme.colors.bg.secondary} 100%
              )`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
