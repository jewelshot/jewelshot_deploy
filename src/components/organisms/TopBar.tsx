'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

export function TopBar() {
  const { topOpen, leftOpen, rightOpen } = useSidebarStore();

  return (
    <header
      className="fixed z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[rgba(10,10,10,0.7)] px-4 backdrop-blur-[24px] backdrop-saturate-[200%] panel-transition"
      style={{
        top: topOpen ? '0px' : '-64px',
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">Jewelshot®</span>
      </div>

      {/* Credits now in User Profile (Sidebar) */}
      <div />
    </header>
  );
}

export default TopBar;
