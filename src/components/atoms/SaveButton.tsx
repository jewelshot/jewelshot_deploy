'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useLanguage } from '@/lib/i18n';

interface SaveButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function SaveButton({ onClick }: SaveButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Tooltip content={t.tooltips.saveToGallery} side="bottom">
      <button
        onClick={onClick}
        className="ctrl-btn-md"
        aria-label={t.tooltips.saveToGallery}
      >
        <Save className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default SaveButton;
