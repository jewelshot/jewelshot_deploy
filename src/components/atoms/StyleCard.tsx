/**
 * Style Card Component
 * Premium card for style presets
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { premiumTheme } from '@/styles/mobile-premium';

interface StyleCardProps {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  isSelected?: boolean;
  onClick: (id: string) => void;
}

export function StyleCard({
  id,
  name,
  description,
  previewGradient,
  isSelected = false,
  onClick,
}: StyleCardProps) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        background: premiumTheme.colors.bg.tertiary,
        border: `2px solid ${
          isSelected
            ? premiumTheme.colors.accent.primary
            : premiumTheme.colors.border.default
        }`,
        borderRadius: premiumTheme.radius.lg,
        padding: premiumTheme.spacing.md,
        cursor: 'pointer',
        transition: `all ${premiumTheme.animation.duration.normal} ${premiumTheme.animation.easing.smooth}`,
        width: '100%',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        boxShadow: isSelected ? premiumTheme.shadow.glow : 'none',
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Preview Gradient */}
      <div
        style={{
          height: '80px',
          borderRadius: premiumTheme.radius.md,
          background: previewGradient,
          marginBottom: premiumTheme.spacing.md,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: premiumTheme.spacing.sm,
              right: premiumTheme.spacing.sm,
              background: premiumTheme.colors.gradient.primary,
              borderRadius: premiumTheme.radius.full,
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: premiumTheme.colors.text.primary,
              boxShadow: premiumTheme.shadow.md,
            }}
          >
            <Check size={16} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <h4
          style={{
            fontSize: premiumTheme.typography.fontSize.base,
            fontWeight: premiumTheme.typography.fontWeight.semibold,
            color: premiumTheme.colors.text.primary,
            margin: 0,
            marginBottom: premiumTheme.spacing.xs,
          }}
        >
          {name}
        </h4>
        <p
          style={{
            fontSize: premiumTheme.typography.fontSize.sm,
            color: premiumTheme.colors.text.secondary,
            margin: 0,
            lineHeight: premiumTheme.typography.lineHeight.normal,
          }}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
