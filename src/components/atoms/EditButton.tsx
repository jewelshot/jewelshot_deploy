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
        className={`ctrl-btn-md ${active ? 'active' : ''}`}
        aria-label={t.common.edit}
      >
        <Sliders className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default EditButton;
