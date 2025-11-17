'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { RateLimitIndicator } from '@/components/molecules/RateLimitIndicator';
import { Bell } from 'lucide-react';

export function BottomBar() {
  const { bottomOpen, leftOpen, rightOpen } = useSidebarStore();

  return (
    <footer
      className="fixed z-50 flex h-14 items-center justify-between border-t border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-4 backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        bottom: bottomOpen ? '0px' : '-56px',
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Left: AI Requests Tracker */}
      <div className="flex items-center gap-2">
        <RateLimitIndicator className="w-[200px]" />
      </div>

      {/* Right: Notification Info */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
          <Bell className="h-3.5 w-3.5 text-white/40" />
          <span className="text-[11px] font-medium text-white/40">
            Notifications appear here
          </span>
        </div>
      </div>
    </footer>
  );
}

export default BottomBar;
