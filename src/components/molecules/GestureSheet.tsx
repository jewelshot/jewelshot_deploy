/**
 * Gesture Sheet Component
 * iOS-style bottom sheet with drag-to-dismiss
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { premiumTheme } from '@/styles/mobile-premium';

interface GestureSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  snapPoints?: number[]; // Percentage heights: [50, 90]
  initialSnap?: number; // Index of snapPoints
}

export function GestureSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  snapPoints = [60, 90],
  initialSnap = 0,
}: GestureSheetProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const currentHeight = snapPoints[currentSnap];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Only allow dragging down
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // If dragged down more than 100px, close
    if (dragOffset > 100) {
      onClose();
    } else if (dragOffset > 50 && currentSnap === 1) {
      // Snap to lower position
      setCurrentSnap(0);
    }

    setDragOffset(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: premiumTheme.colors.bg.overlay,
          backdropFilter: premiumTheme.blur.md,
          zIndex: premiumTheme.zIndex.modal,
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${currentHeight}vh`,
          background: premiumTheme.colors.bg.secondary,
          borderTopLeftRadius: premiumTheme.radius.xxl,
          borderTopRightRadius: premiumTheme.radius.xxl,
          boxShadow: `${premiumTheme.shadow.xl}, 0 -4px 40px rgba(102, 126, 234, 0.2)`,
          zIndex: premiumTheme.zIndex.modal + 1,
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging
            ? 'none'
            : `all ${premiumTheme.animation.duration.normal} ${premiumTheme.animation.easing.smooth}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Drag Handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            padding: `${premiumTheme.spacing.md} 0`,
            display: 'flex',
            justifyContent: 'center',
            cursor: 'grab',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '4px',
              background: premiumTheme.colors.border.default,
              borderRadius: premiumTheme.radius.full,
            }}
          />
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div
            style={{
              padding: `0 ${premiumTheme.spacing.lg} ${premiumTheme.spacing.lg}`,
              borderBottom: `1px solid ${premiumTheme.colors.border.default}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: subtitle ? premiumTheme.spacing.sm : 0,
              }}
            >
              {title && (
                <h3
                  style={{
                    fontSize: premiumTheme.typography.fontSize.xl,
                    fontWeight: premiumTheme.typography.fontWeight.bold,
                    color: premiumTheme.colors.text.primary,
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                style={{
                  background: premiumTheme.colors.bg.tertiary,
                  border: 'none',
                  borderRadius: premiumTheme.radius.full,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: premiumTheme.colors.text.secondary,
                  cursor: 'pointer',
                  transition: `all ${premiumTheme.animation.duration.fast} ease`,
                }}
              >
                <X size={18} />
              </button>
            </div>
            {subtitle && (
              <p
                style={{
                  fontSize: premiumTheme.typography.fontSize.sm,
                  color: premiumTheme.colors.text.secondary,
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: premiumTheme.spacing.lg,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
