'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';

interface SaveButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <Tooltip content="Save" side="bottom">
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
        aria-label="Save"
      >
        <Save className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default SaveButton;
