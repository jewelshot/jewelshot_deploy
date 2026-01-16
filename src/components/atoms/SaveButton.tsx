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
    <Tooltip content={t.common.save} side="bottom">
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
        aria-label={t.common.save}
      >
        <Save className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default SaveButton;
