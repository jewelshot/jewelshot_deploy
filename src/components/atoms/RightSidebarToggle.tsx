/**
 * Right Sidebar Toggle Button Component
 *
 * A toggle button to show/hide the right sidebar.
 * Mirror/symmetric version of the left sidebar toggle.
 *
 * @example
 * ```tsx
 * <RightSidebarToggle />
 * ```
 */

'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

export function RightSidebarToggle() {
  const { rightOpen, toggleRight } = useSidebarStore();

  return (
    <button
      onClick={toggleRight}
      className={`fixed top-1/2 z-[200] flex h-8 w-3 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/10 bg-[rgba(17,17,17,0.8)] panel-transition hover:border-white/20 hover:bg-white/[0.08] hover:backdrop-blur-[10px] ${
        rightOpen
          ? 'right-[248px] rounded-r-md border-l-0 border-r'
          : 'right-0 rounded-l-md border-l border-r-0'
      } `}
      aria-label={rightOpen ? 'Close right sidebar' : 'Open right sidebar'}
      aria-expanded={rightOpen}
    >
      {/* Arrow Icon */}
      <span
        className={`text-[8px] text-white/40 panel-transition group-hover:text-white/70 ${rightOpen ? 'rotate-180' : 'rotate-0'} `}
      >
        ‹
      </span>
    </button>
  );
}

export default RightSidebarToggle;
