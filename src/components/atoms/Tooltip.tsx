/**
 * Tooltip Component
 *
 * Simple tooltip for hover states
 * Uses CSS-only approach for reliability
 */

'use client';

import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
}

export function Tooltip({
  content,
  children,
  side = 'left',
}: TooltipProps) {
  // Position classes based on side
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="group/tooltip relative inline-flex">
      {children}
      {/* Tooltip - shows on parent hover */}
      <div
        role="tooltip"
        className={`
          pointer-events-none absolute z-[99999]
          ${positionClasses[side]}
          opacity-0 scale-95
          transition-all duration-150 ease-out
          group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100
          group-hover/tooltip:delay-150
        `}
      >
        <div className="rounded-md border border-white/20 bg-neutral-900 px-2.5 py-1.5 shadow-xl">
          <p className="whitespace-nowrap text-xs font-medium text-white">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
