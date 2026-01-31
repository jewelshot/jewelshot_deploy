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
        className="ctrl-btn-md"
        aria-label={t.tooltips.downloadImage}
      >
        <Download className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default DownloadButton;
