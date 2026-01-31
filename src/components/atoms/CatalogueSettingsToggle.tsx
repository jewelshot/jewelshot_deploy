/**
 * CatalogueSettingsToggle Component
 *
 * Toggle button for catalogue settings sidebar.
 * Mirror of RightSidebarToggle but for catalogue-specific sidebar.
 */

'use client';

import React from 'react';

interface CatalogueSettingsToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CatalogueSettingsToggle({
  isOpen,
  onToggle,
}: CatalogueSettingsToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-1/2 z-[200] flex h-8 w-3 -translate-y-1/2 cursor-pointer items-center justify-center border border-[rgba(139,92,246,0.2)] bg-[rgba(17,17,17,0.8)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:backdrop-blur-[10px] ${
        isOpen
          ? 'right-[338px] rounded-r-md border-l-0 border-r'
          : 'right-0 rounded-l-md border-l border-r-0'
      } `}
      aria-label={isOpen ? 'Close settings sidebar' : 'Open settings sidebar'}
      aria-expanded={isOpen}
    >
      {/* Arrow Icon */}
      <span
        className={`text-[8px] text-white/60 transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] group-hover:text-[rgba(139,92,246,1)] ${isOpen ? 'rotate-180' : 'rotate-0'} `}
      >
        ‹
      </span>
    </button>
  );
}

export default CatalogueSettingsToggle;


