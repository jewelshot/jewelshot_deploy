'use client';

import React from 'react';
import { Sliders } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useLanguage } from '@/lib/i18n';

interface EditButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
  /**
   * Whether the button is active
   */
  active?: boolean;
}

/**
 * EditButton - Atomic component for opening edit panel
 */
export function EditButton({ onClick, active = false }: EditButtonProps) {
  const { t } = useLanguage();
  
  return (
    <Tooltip content={t.common.edit} side="bottom">
      <button
        onClick={onClick}
        className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all ${
          active
            ? 'border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.15)] text-white'
            : 'border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white'
        }`}
        aria-label={t.common.edit}
      >
        <Sliders className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default EditButton;
