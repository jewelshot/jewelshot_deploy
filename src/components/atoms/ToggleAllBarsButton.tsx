'use client';

import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useLanguage } from '@/lib/i18n';

interface ToggleAllBarsButtonProps {
  /**
   * Whether all bars are currently open
   */
  allBarsOpen: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

export function ToggleAllBarsButton({
  allBarsOpen,
  onClick,
}: ToggleAllBarsButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Tooltip content={t.tooltips.toggleSidebar} side="bottom">
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
        aria-label={t.tooltips.toggleSidebar}
      >
        {allBarsOpen ? (
          <Minimize2 className="h-3.5 w-3.5" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5" />
        )}
      </button>
    </Tooltip>
  );
}

export default ToggleAllBarsButton;
