'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

export function TopBarToggle() {
  const { topOpen, toggleTop, leftOpen, rightOpen } = useSidebarStore();

  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;

  return (
    <button
      onClick={toggleTop}
      className={`fixed z-[200] flex h-3 w-8 -translate-x-1/2 cursor-pointer items-center justify-center border border-white/10 bg-[rgba(17,17,17,0.8)] transition-[top,background-color,border-color,backdrop-filter] duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-white/20 hover:bg-white/[0.08] hover:backdrop-blur-[10px] ${
        topOpen
          ? 'rounded-t-md border-b-0 border-t'
          : 'rounded-b-md border-b border-t-0'
      }`}
      style={{
        top: topOpen ? '52px' : '0px',
        left: `calc(${leftPos}px + (100% - ${leftPos}px - ${rightPos}px) / 2)`,
      }}
      aria-label={topOpen ? 'Close top bar' : 'Open top bar'}
      aria-expanded={topOpen}
    >
      <span
        className={`text-[8px] text-white/40 panel-transition group-hover:text-white/70 ${
          topOpen ? 'rotate-0' : 'rotate-180'
        }`}
      >
        ∧
      </span>
    </button>
  );
}

export default TopBarToggle;
