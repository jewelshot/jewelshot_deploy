/**
 * SidebarToggle Component
 *
 * A micro toggle button that opens/closes the sidebar.
 * Features smooth animations and glassmorphism effects.
 *
 * @example
 * ```tsx
 * <SidebarToggle />
 * ```
 */

'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

export function SidebarToggle() {
  const { leftOpen, toggleLeft } = useSidebarStore();

  // Sidebar width: 240px, Toggle width: 16px (w-4)
  // Expand (open): Inside sidebar, attached to right edge → left = 240 - 16 = 224px
  // Collapse (closed): Outside, at screen edge → left = 0
  
  return (
    <button
      onClick={toggleLeft}
      className={`fixed top-1/2 z-[200] flex h-10 w-4 -translate-y-1/2 cursor-pointer items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-500 ease-in-out hover:bg-white/[0.06] ${
        leftOpen 
          ? 'left-[224px] rounded-r-md border-y border-r border-white/[0.06]' 
          : 'left-0 rounded-r-md border-y border-r border-white/[0.08]'
      }`}
      aria-label={leftOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={leftOpen}
    >
      {/* Arrow Icon */}
      <span
        className={`text-[10px] text-white/40 transition-transform duration-500 ease-in-out hover:text-white/60 ${leftOpen ? '' : 'rotate-180'}`}
      >
        ‹
      </span>
    </button>
  );
}

export default SidebarToggle;
