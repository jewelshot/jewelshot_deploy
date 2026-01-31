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
        className="ctrl-btn-md"
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
