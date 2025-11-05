'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { CreditCounter } from '@/components/molecules/CreditCounter';

export function TopBar() {
  const { topOpen, leftOpen, rightOpen } = useSidebarStore();

  return (
    <header
      className="fixed z-50 flex h-16 items-center justify-between border-b border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-4 backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        top: topOpen ? '0px' : '-64px',
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">Jewelshot</span>
      </div>

      {/* Credit Counter */}
      <CreditCounter variant="desktop" />
    </header>
  );
}

export default TopBar;
