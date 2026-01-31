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
        className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
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
