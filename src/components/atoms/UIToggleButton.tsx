'use client';

import React from 'react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useLanguage } from '@/lib/i18n';

interface UIToggleButtonProps {
  controlsVisible: boolean;
  onToggle: () => void;
}

export default function UIToggleButton({
  controlsVisible,
  onToggle,
}: UIToggleButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Tooltip content={t.tooltips.toggleUI} side="bottom">
      <button
        onClick={onToggle}
        className={`group relative z-50 flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-300 ${
          controlsVisible
            ? 'border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/70'
            : 'border-white/20 bg-white/10 text-white/70 shadow-[0_0_12px_rgba(255,255,255,0.1)] hover:border-white/30 hover:bg-white/15'
        }`}
        aria-label={t.tooltips.toggleUI}
        style={{ cursor: 'pointer' }}
      >
      {/* Icon */}
      <div className="relative h-3.5 w-3.5">
        {/* Eye Off (Hidden) */}
        <svg
          className={`absolute inset-0 transition-all duration-300 ${
            controlsVisible ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>

        {/* Eye On (Visible) */}
        <svg
          className={`absolute inset-0 transition-all duration-300 ${
            controlsVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </div>

        {/* Pulsing indicator when hidden */}
        {!controlsVisible && (
          <div className="absolute inset-0 animate-pulse rounded-lg bg-white/5" />
        )}
      </button>
    </Tooltip>
  );
}
