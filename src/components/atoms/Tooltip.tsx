/**
 * Tooltip Component
 *
 * Simple tooltip for displaying helpful information on hover
 */

'use client';

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg dark:bg-gray-700 ${placementClasses[placement]} `}
        >
          {content}
        </div>
      )}
    </div>
  );
};
