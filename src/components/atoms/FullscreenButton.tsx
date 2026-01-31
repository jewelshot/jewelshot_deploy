'use client';

import React from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useLanguage } from '@/lib/i18n';

interface FullscreenButtonProps {
  /**
   * Whether fullscreen is active
   */
  isFullscreen: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

export function FullscreenButton({
  isFullscreen,
  onClick,
}: FullscreenButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Tooltip content={t.tooltips.toggleFullscreen} side="bottom">
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
        aria-label={t.tooltips.toggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize className="h-3.5 w-3.5" />
        ) : (
          <Maximize className="h-3.5 w-3.5" />
        )}
      </button>
    </Tooltip>
  );
}

export default FullscreenButton;
