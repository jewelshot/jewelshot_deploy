'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useLanguage } from '@/lib/i18n';

interface DownloadButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function DownloadButton({ onClick }: DownloadButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Tooltip content={t.tooltips.downloadImage} side="bottom">
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
        aria-label={t.tooltips.downloadImage}
      >
        <Download className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default DownloadButton;
