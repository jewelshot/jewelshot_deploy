'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Tooltip } from '@/components/atoms/Tooltip';

interface ViewModeSelectorProps {
  viewMode: 'normal' | 'side-by-side';
  onViewModeChange: (mode: 'normal' | 'side-by-side') => void;
  disabled?: boolean;
}

export function ViewModeSelector({
  viewMode,
  onViewModeChange,
  disabled = false,
}: ViewModeSelectorProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-[rgba(10,10,10,0.8)] p-0.5 backdrop-blur-[16px]">
      {/* Normal View */}
      <Tooltip content={t.tooltips.viewModeNormal} side="bottom">
        <button
          onClick={() => onViewModeChange('normal')}
          disabled={disabled}
          className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
            viewMode === 'normal'
              ? 'bg-white/10 text-white/80'
              : 'text-white/50 hover:text-white/70'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          <span>{t.tooltips.normalView}</span>
        </button>
      </Tooltip>

      {/* Side by Side View */}
      <Tooltip content={t.tooltips.viewModeCompare} side="bottom">
        <button
          onClick={() => onViewModeChange('side-by-side')}
          disabled={disabled}
          className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
            viewMode === 'side-by-side'
              ? 'bg-white/10 text-white/80'
              : 'text-white/50 hover:text-white/70'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="18" rx="1" />
          </svg>
          <span>{t.common.compare}</span>
        </button>
      </Tooltip>
    </div>
  );
}

export default ViewModeSelector;
