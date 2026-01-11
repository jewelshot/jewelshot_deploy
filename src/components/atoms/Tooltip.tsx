/**
 * Tooltip Component
 *
 * Simple tooltip for hover states
 * Uses Portal to escape stacking contexts
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({
  content,
  children,
  side = 'left',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 8;
      
      let top = 0;
      let left = 0;
      
      switch (side) {
        case 'top':
          top = rect.top - gap;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + gap;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - gap;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + gap;
          break;
      }
      
      setCoords({ top, left });
      setIsVisible(true);
    }, 100); // 100ms delay
  }, [side]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  // Transform classes based on side
  const transformClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      
      {mounted && isVisible && createPortal(
        <div
          role="tooltip"
          style={{ top: coords.top, left: coords.left }}
          className={`
            pointer-events-none fixed z-[999999]
            ${transformClasses[side]}
            animate-in fade-in-0 zoom-in-95 duration-100
          `}
        >
          <div className="rounded-md border border-white/20 bg-neutral-900 px-2.5 py-1.5 shadow-2xl">
            <p className="whitespace-nowrap text-xs font-medium text-white">
              {content}
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
